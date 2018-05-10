var express = require('express');
var app = express();
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');

var credenciales = {
    user:"root",
    password:"conejomemo1",
    host:"localhost",
    database:"DB_UNAH",
    port:"3306"
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({secret:"1de8ee84a8f4071b2b22df22e11a5199",resave:true, saveUninitialized:true}));

var alumno = express.static('alumno');
var profesor = express.static('profesor');
var administrador = express.static('administrador');
app.use(
    function(peticion,respuesta,next){
        if (peticion.session.codigo){
            if (peticion.session.codigoTipoUsuario == 0){
                alumno(peticion,respuesta,next);
            }else if (peticion.session.codigoTipoUsuario == 1){
                profesor(peticion,respuesta,next);
            }
            else if (peticion.session.codigoTipoUsuario == 2){
                administrador(peticion,respuesta,next);
            }
        }
        else{
            return next();
            respuesta.redirect('login.html');
        }
    }
);

app.get("/salir",function(peticion, respuesta){
	peticion.session.destroy();
	respuesta.redirect('login.html');
});


app.post("/login",function(peticion, respuesta){
    var conexion = mysql.createConnection(credenciales);
    var tipo = peticion.body.valor;
    if(tipo==0){
    	conexion.query("SELECT CODIGO_ALUMNO "+
					"FROM tbl_alumnos "+
					"WHERE NUMERO_CUENTA=? "+
					"AND CONTRASEÑA=?",
        [peticion.body.codigo, peticion.body.pass],
        function(err, data, fields){
                if (data.length>0){
                    peticion.session.codigo = data[0].CODIGO_ALUMNO;
                    peticion.session.codigoTipoUsuario = 0;
                    data[0].estatus = 0;
                    respuesta.send(data[0]); 
                }else{
                    respuesta.send({estatus:1, mensaje: "Login fallido"}); 
                }	
         }
    	); 
    }else if(tipo==1){
    	conexion.query("SELECT CODIGO_EMPLEADO "+
						"FROM tbl_empleados "+
						"WHERE NUMERO_EMPLEADO=? "+
						"AND CODIGO_TIPO_EMPLEADO=1 "+
						"AND PASSWORD=?",
        [peticion.body.codigo, peticion.body.pass],
        function(err, data, fields){
                if (data.length>0){
                    peticion.session.codigo = data[0].CODIGO_EMPLEADO;
                    peticion.session.codigoTipoUsuario = 1;
                    data[0].estatus = 0;
                    respuesta.send(data[0]); 
                }else{
                    respuesta.send({estatus:1, mensaje: "Login fallido"}); 
                }	
         }
    	); 
    }else{

    }
    
});


//-------------------ALUMNOS------------------------------------------------------

app.post("/obtenerValores",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("SELECT p.NOMBRE,p.APELLIDO,a.NUMERO_CUENTA,c.NOMBRE_CARRERA,pac.NOMBRE_PERIODO,a.PROMEDIO "+
					"FROM tbl_alumnos as a,tbl_personas as p,tbl_carreras_x_alumnos as ca,tbl_carreras as c,tbl_periodos as pac "+
					"WHERE a.CODIGO_ALUMNO=p.CODIGO_PERSONA AND ca.CODIGO_ALUMNO=a.CODIGO_ALUMNO "+
					"AND ca.CODIGO_CARRERA=c.CODIGO_CARRERA AND pac.ACTIVO=1 AND a.CODIGO_ALUMNO=?",
					[peticion.session.codigo],
		function(error, informacion, campos){
			conexion.end();
			respuesta.send(informacion);
	});
});

app.post("/matriculaCombo1",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	var valores=[];
	conexion.query("SELECT DISTINCT tbl_carreras.CODIGO_CARRERA, tbl_carreras.NOMBRE_CARRERA "+
					"FROM tbl_carreras, tbl_relacion "+
					"WHERE tbl_carreras.CODIGO_CARRERA IN "+
					"( SELECT tbl_relacion.CODIGO_CARRERA_DESTINO "+
					"FROM tbl_carreras, tbl_relacion ,tbl_carreras_x_alumnos "+
					"WHERE tbl_relacion.CODIGO_CARRERA_ORIGEN=tbl_carreras_x_alumnos.CODIGO_CARRERA "+
					"AND tbl_carreras_x_alumnos.CODIGO_ALUMNO=? "+
					"AND tbl_relacion.CODIGO_CARRERA_ORIGEN=tbl_carreras.CODIGO_CARRERA)",
					[peticion.session.codigo],
		function(error, informacion, campos){
			valores=informacion;
	});
	conexion.query("SELECT tbl_carreras.CODIGO_CARRERA , tbl_carreras.NOMBRE_CARRERA "+
					"FROM tbl_carreras, tbl_carreras_x_alumnos "+
					"WHERE tbl_carreras.CODIGO_CARRERA=tbl_carreras_x_alumnos.CODIGO_CARRERA "+
					"AND tbl_carreras_x_alumnos.CODIGO_ALUMNO=?",
					[peticion.session.codigo],
		function(error, informacion, campos){
			conexion.end();
			valores.push(informacion);
			respuesta.send(valores);
	});
});



app.post("/matriculaCombo2",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	var conexion2 = mysql.createConnection(credenciales);
	var asignaturas=[];
	sql1="SELECT tbl_asignaturas.CODIGO_ASIGNATURA , tbl_asignaturas.NOMBRE_ASIGNATURA "+
					"FROM tbl_carreras, tbl_asignaturas "+
					"WHERE tbl_asignaturas.CODIGO_CARRERA=tbl_carreras.CODIGO_CARRERA "+
					"AND tbl_carreras.CODIGO_CARRERA="+peticion.body.id;
	conexion.query(sql1)
	.on('result',function (asignatura) {
		asignatura.pasada=0;
		conexion.pause();
		conexion2.query("SELECT asi.CODIGO_ASIGNATURA "+
						"FROM tbl_historial as his, tbl_alumnos as alu, "+
						"tbl_seccion as sec, tbl_periodos as pac, "+
						"tbl_asignaturas as asi "+
						"WHERE his.CODIGO_ALUMNO=alu.CODIGO_ALUMNO "+
						"AND his.CODIGO_SECCION=sec.CODIGO_SECCION "+
						"AND his.CODIGO_PERIODO=pac.CODIGO_PERIODO "+
						"AND asi.CODIGO_ASIGNATURA=sec.CODIGO_ASIGNATURA "+
						"AND pac.ACTIVO=0 "+
						"AND his.PROMEDIO>65 "+
						"AND alu.CODIGO_ALUMNO=? "+
						"AND asi.CODIGO_ASIGNATURA=?",[peticion.session.codigo,asignatura.CODIGO_ASIGNATURA])
		.on('result', function(verificar){
			asignatura.pasada=1;
		})
        .on('end',function(){
        	asignaturas.push(asignatura);
            conexion.resume();
		});
	})
	.on('end',function(){
        conexion.end();
        conexion2.end();
        respuesta.send(asignaturas);
    });
});




app.post("/matriculaCombo3",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	var conexion2 = mysql.createConnection(credenciales);
	var secciones=[];
	var val=1;
	var sql1="SELECT tbl_seccion.CODIGO_SECCION , tbl_seccion.HORA_INICIO, "+
					"tbl_seccion.CANTIDAD_CUPOS, tbl_seccion.DIAS "+
					"FROM  tbl_asignaturas, tbl_seccion,tbl_periodos "+
					"WHERE tbl_seccion.CODIGO_ASIGNATURA=tbl_asignaturas.CODIGO_ASIGNATURA "+
					"AND tbl_seccion.CODIGO_PERIODO=tbl_periodos.CODIGO_PERIODO "+
					"AND tbl_periodos.ACTIVO=1 "+
					"AND tbl_asignaturas.CODIGO_ASIGNATURA="+peticion.body.id;
	conexion.query(sql1)
	.on('result',function (seccion) {
		secciones.push(seccion);
		conexion.pause();
		conexion2.query("SELECT sec.CODIGO_SECCION "+
						"FROM tbl_historial as his, tbl_alumnos as alu, "+
						"tbl_seccion as sec, tbl_periodos as pac, "+
						"tbl_asignaturas as asi "+
						"WHERE his.CODIGO_ALUMNO=alu.CODIGO_ALUMNO "+
						"AND his.CODIGO_SECCION=sec.CODIGO_SECCION "+
						"AND his.CODIGO_PERIODO=pac.CODIGO_PERIODO "+
						"AND asi.CODIGO_ASIGNATURA=sec.CODIGO_ASIGNATURA "+
						"AND pac.ACTIVO=1 "+
						"AND alu.CODIGO_ALUMNO=? "+
						"AND sec.CODIGO_SECCION=?",[peticion.session.codigo,seccion.CODIGO_SECCION])
        .on('result', function(verificar){
            if(verificar.CODIGO_SECCION==seccion.CODIGO_SECCION){
            	val=0;
            }
        })
        .on('end',function(){
            conexion.resume();
		});
	})
	.on('end',function(){
        conexion.end();
        conexion2.end();
        if(val==0){
        	secciones={'CODIGO_SECCION':'matriculado'};
        	respuesta.send(secciones);	
        }else{
        	respuesta.send(secciones);
        }
        
    });


});

app.post("/ClasesMatriculadas",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("SELECT his.PROMEDIO, his.CODIGO__HISTORIAL, asi.CODIGO_ASIGNATURA , asi.NOMBRE_ASIGNATURA, "+
					"sec.HORA_INICIO,sec.HORA_INICIO,sec.HORA_FIN, "+
					"sec.DIAS,edi.NOMBRE_EDIFICIO,au.NUMERO_AULA, "+
					"asi.CANTIDAD_UNIDADES_VALORATIVAS,pac.NOMBRE_PERIODO "+
					"FROM tbl_historial as his, tbl_alumnos as alu, "+
					"tbl_seccion as sec, tbl_periodos as pac, "+
					"tbl_asignaturas as asi,tbl_aulas as au, "+
					"tbl_edificios as edi "+
					"WHERE his.CODIGO_ALUMNO=alu.CODIGO_ALUMNO "+
					"AND his.CODIGO_SECCION=sec.CODIGO_SECCION "+
					"AND his.CODIGO_PERIODO=pac.CODIGO_PERIODO "+
					"AND asi.CODIGO_ASIGNATURA=sec.CODIGO_ASIGNATURA "+
					"AND au.CODIGO_AULA=sec.CODIGO_AULA "+
					"AND edi.CODIGO_EDIFICIO=au.CODIGO_EDIFICIO "+
					"AND pac.ACTIVO=1 "+
					"AND alu.CODIGO_ALUMNO=?",
					[peticion.session.codigo],
		function(error, informacion, campos){
			conexion.end();
			respuesta.send(informacion);
	});
});

app.post("/ClasesHistorial",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("SELECT  asi.CODIGO_ASIGNATURA , asi.NOMBRE_ASIGNATURA, "+
					"asi.CANTIDAD_UNIDADES_VALORATIVAS,pac.NOMBRE_PERIODO, "+
					"sec.HORA_INICIO, his.PROMEDIO "+
					"FROM tbl_historial as his, tbl_alumnos as alu, "+
					"tbl_seccion as sec, tbl_periodos as pac, "+
					"tbl_asignaturas as asi,tbl_aulas as au, "+
					"tbl_edificios as edi "+
					"WHERE his.CODIGO_ALUMNO=alu.CODIGO_ALUMNO "+
					"AND his.CODIGO_SECCION=sec.CODIGO_SECCION "+
					"AND his.CODIGO_PERIODO=pac.CODIGO_PERIODO "+
					"AND asi.CODIGO_ASIGNATURA=sec.CODIGO_ASIGNATURA "+
					"AND au.CODIGO_AULA=sec.CODIGO_AULA "+
					"AND edi.CODIGO_EDIFICIO=au.CODIGO_EDIFICIO "+
					"AND pac.ACTIVO=0 "+
					"AND alu.CODIGO_ALUMNO=?",
					[peticion.session.codigo],
		function(error, informacion, campos){
			conexion.end();
			respuesta.send(informacion);
	});
});

app.post("/matricular",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("INSERT INTO tbl_historial (CODIGO_ALUMNO, CODIGO_SECCION, CODIGO_PERIODO, PROMEDIO) "+
					"VALUES (?, ?,(SELECT pac.CODIGO_PERIODO "+
					"FROM tbl_periodos as pac "+
					"WHERE pac.ACTIVO=1), '0');",
					[peticion.session.codigo,peticion.body.idseccion],
		function(error, resultado){
			conexion.end();
			respuesta.send(resultado);
	});
});

app.post("/Eliminar",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("DELETE FROM tbl_historial "+
				   "WHERE ((CODIGO__HISTORIAL = ?))",
					[peticion.body.id],
		function(error, resultado){
			conexion.end();
			respuesta.send(resultado);
	});
});

//--------------------------------FIN ALUMNOS------------------------------------------------

//-------------------------------PROFESORES---------------------------------------------------


app.post("/obtenerValoresProfesor",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("SELECT pe.NOMBRE,pe.APELLIDO,em.NUMERO_EMPLEADO,fa.NOMBRE_FACULTAD "+
					"FROM tbl_empleados as em,tbl_personas as pe,tbl_facultades as fa "+
					"WHERE em.CODIGO_EMPLEADO=pe.CODIGO_PERSONA "+
					"AND em.CODIGO_FACULTAD=fa.CODIGO_FACULTAD "+
					"AND em.CODIGO_EMPLEADO=?",
					[peticion.session.codigo],
		function(error, informacion, campos){
			conexion.end();
			respuesta.send(informacion);
	});
});



app.post("/obtenerClasesProfesor",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("SELECT sec.CODIGO_SECCION,asi.CODIGO_ASIGNATURA,asi.NOMBRE_ASIGNATURA,sec.HORA_INICIO "+
					"FROM tbl_empleados as em,tbl_seccion as sec,tbl_asignaturas as asi, tbl_periodos as pe "+
					"WHERE em.CODIGO_EMPLEADO=sec.CODIGO_EMPLEADO "+
					"AND sec.CODIGO_ASIGNATURA=asi.CODIGO_ASIGNATURA "+
					"AND sec.CODIGO_PERIODO=pe.CODIGO_PERIODO "+
					"AND pe.ACTIVO=1 "+
					"AND em.CODIGO_EMPLEADO=?",
					[peticion.session.codigo],
		function(error, informacion, campos){
			conexion.end();
			respuesta.send(informacion);
	});
});



app.post("/obtenerSeccionProfesor",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("SELECT sec.CODIGO_SECCION,asi.CODIGO_ASIGNATURA,asi.NOMBRE_ASIGNATURA,sec.HORA_INICIO "+
					"FROM tbl_empleados as em,tbl_seccion as sec,tbl_asignaturas as asi,tbl_periodos as pe "+
					"WHERE em.CODIGO_EMPLEADO=sec.CODIGO_EMPLEADO "+
					"AND sec.CODIGO_ASIGNATURA=asi.CODIGO_ASIGNATURA "+
					"AND sec.CODIGO_PERIODO=pe.CODIGO_PERIODO "+
					"AND pe.ACTIVO=1 "+
					"AND sec.CODIGO_SECCION=? "+
					"AND em.CODIGO_EMPLEADO=?",
					[peticion.body.id,peticion.session.codigo],
		function(error, informacion, campos){
			conexion.end();
			respuesta.send(informacion);
	});
});

app.post("/obtenerAlumnosSeccion",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("SELECT his.CODIGO__HISTORIAL, alu.CODIGO_ALUMNO, alu.NUMERO_CUENTA, per.NOMBRE, per.APELLIDO,his.PROMEDIO "+
					"FROM tbl_historial as his,tbl_seccion as sec, tbl_alumnos as alu, "+
					"tbl_periodos as pe,tbl_personas as per "+
					"WHERE his.CODIGO_ALUMNO=alu.CODIGO_ALUMNO "+
					"AND his.CODIGO_SECCION=sec.CODIGO_SECCION "+
					"AND per.CODIGO_PERSONA=alu.CODIGO_ALUMNO "+
					"AND his.CODIGO_PERIODO=pe.CODIGO_PERIODO "+
					"AND sec.CODIGO_SECCION=?",
					[peticion.body.id],
		function(error, informacion, campos){
			conexion.end();
			respuesta.send(informacion);
	});
});

app.post("/asignarNota",function (peticion,respuesta) {
	var conexion = mysql.createConnection(credenciales);
	conexion.query("UPDATE tbl_historial SET "+
					"PROMEDIO =? "+
					"WHERE CODIGO__HISTORIAL = ?",
					[peticion.body.nota,peticion.body.id],
		function(error, resultado){
			conexion.end();
			respuesta.send(resultado);
	});
});


//--------------------------------FIN PROFESORES----------------------------------------------



app.listen(4000);