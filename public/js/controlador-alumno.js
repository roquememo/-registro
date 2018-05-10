$(document).ready(function () {

	//combo dependiente 1
	$('#adicionar1').unbind('change').bind('change', function (e){
    	var valor = $('#adicionar1').val();
   		$("#adicionar2").html('');
   		$("#adicionar3").html('');
   		$('#error').html('');
   		$.ajax({
		url:'/matriculaCombo2',
		method:'POST',
		data: 'id='+valor,
		dataType:"json",
		success:function (respuesta) {
			for (var i = 0; i < respuesta.length; i++) {
				if(respuesta[i].pasada==0){
					$("#adicionar2").append('<option value="'+respuesta[i].CODIGO_ASIGNATURA+'">'+respuesta[i].NOMBRE_ASIGNATURA +'</option>');
				}
			}
		},
		error:function (error) {
			alert('Error en matricula combo2');
		}
	});
   		$("#btn_matricular").attr('hidden',true);
  });
	//combo dependiente 2
	 	$('#adicionar2').unbind('change').bind('change', function (e){
    	var valor = $('#adicionar2').val();
   		$("#adicionar3").html('');
   		$('#error').html('');
   		$.ajax({
		url:'/matriculaCombo3',
		method:'POST',
		data: 'id='+valor,
		dataType:"json",
		success:function (respuesta) {
			if(respuesta.CODIGO_SECCION=='matriculado'){
				$('#error').html('ESTA CLASE YA ESTA MATRICULADA');
			}else{
				for (var i = 0; i < respuesta.length; i++) {
				$("#adicionar3").append('<option value="'+respuesta[i].CODIGO_SECCION+'">Seccion:'+respuesta[i].HORA_INICIO +' Dias: '+respuesta[i].DIAS+' Cupos:'+respuesta[i].CANTIDAD_CUPOS+'</option>');
				}
			}
		},
		error:function (error) {
			alert('Error en matricula combo3');
		}
	});
   		$("#btn_matricular").attr('hidden',true);
  });
	 	//combo dependiente 3
	 	$('#adicionar3').unbind('change').bind('change', function (e){
    	$('#valorSeccion').val($('#adicionar3').val());
   		$("#btn_matricular").attr('hidden',false);
  });

	$.ajax({
		url:'/obtenerValores',
		method:'POST',
		dataType:"json",
		success:function (respuesta) {
			$("#valoresAlumno").html('<tr>'+
                      '<th scope="row">Nombre</th>'+
                      '<td>'+respuesta[0].NOMBRE+' '+respuesta[0].APELLIDO+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<th scope="row">Cuenta</th>'+
                      '<td>'+respuesta[0].NUMERO_CUENTA+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<th scope="row">Carrera</th>'+
                      '<td>'+respuesta[0].NOMBRE_CARRERA+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<th scope="row">Periodo</th>'+
                      '<td>'+respuesta[0].NOMBRE_PERIODO+'</td>'+
                   ' </tr>'+
                    '<tr>'+
                      '<th scope="row">Promedio Periodo</th>'+
                      '<td>90</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<th scope="row">Promedio Global</th>'+
                      '<td>'+respuesta[0].PROMEDIO+'</td>'+
                    '</tr>');
		},
		error:function (error) {
			alert('Error al cargar valores de alumno');
		}
	});


	$.ajax({
		url:'/matriculaCombo1',
		method:'POST',
		dataType:"json",
		success:function (respuesta) {
			$("#adicionar1").html('');
			for (var i = 0; i < (respuesta.length-1); i++) {
				$("#adicionar1").append('<option value="'+respuesta[i].CODIGO_CARRERA+'">'+respuesta[i].NOMBRE_CARRERA+'</option>');
			}
			$("#adicionar1").append('<option value="'+respuesta[respuesta.length-1][0].CODIGO_CARRERA+'">'+respuesta[respuesta.length-1][0].NOMBRE_CARRERA+'</option>');
		},
		error:function (error) {
			alert('Error en matricula combo1');
		}
	});





});

function matricula() {
	var idseccion = $('#valorSeccion').val();
	$.ajax({
		url:'/matricular',
		method:'POST',
		data:'idseccion='+idseccion,
		dataType:"json",
		success:function (respuesta) {
			alert('Clase Matriculada');
			cargarClasesMatriculadas();
			$("#adicionar3").html('');
			$("#adicionar2").html('');
   			$('#error').html('');
   			$("#btn_matricular").attr('hidden',true);
		},
		error:function (error) {
			alert('Error al matricular clase');
		}
	});
}

function cargarClasesMatriculadas() {
	$.ajax({
		url:'/ClasesMatriculadas',
		method:'POST',
		dataType:"json",
		success:function (respuesta) {
			$("#clasesMatriculadas").html('');
			for (var i = 0; i < respuesta.length; i++) {
				$("#clasesMatriculadas").append('<tr>'+
                  '<td>'+respuesta[i].CODIGO_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].HORA_INICIO+'</td>'+
                  '<td>'+respuesta[i].HORA_INICIO+'</td>'+
                  '<td>'+respuesta[i].HORA_FIN+'</td>'+
                  '<td>'+respuesta[i].DIAS+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_EDIFICIO+'</td>'+
                  '<td>'+respuesta[i].NUMERO_AULA+'</td>'+
                  '<td>'+respuesta[i].CANTIDAD_UNIDADES_VALORATIVAS+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_PERIODO+'</td>'+
               	'</tr>');
			}
		},
		error:function (error) {
			alert('Error al cargar clases');
		}
	});
}


function cargarClasesHistorial() {
	$.ajax({
		url:'/ClasesHistorial',
		method:'POST',
		dataType:"json",
		success:function (respuesta) {
			console.log(respuesta);
			$("#Clases-historial").html('');
			for (var i = 0; i < respuesta.length; i++) {
				var periodo= respuesta[i].NOMBRE_PERIODO.split(' ');
				var obs='RPB';
				if(respuesta[i].PROMEDIO>=65){
					obs='APR';
				}
				$("#Clases-historial").append('<tr>'+
                  '<td>'+respuesta[i].CODIGO_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].CANTIDAD_UNIDADES_VALORATIVAS+'</td>'+
                  '<td>'+respuesta[i].HORA_INICIO+'</td>'+
                  '<td>'+periodo[2]+'</td>'+
                  '<td>'+periodo[0]+'</td>'+
                  '<td>'+respuesta[i].PROMEDIO+'</td>'+
                  '<td>'+obs+'</td>'+
               	'</tr>');
			}
		},
		error:function (error) {
			alert('Error al cargar clases historial');
		}
	});
}

function cargarClasesCalificaciones() {
	$.ajax({
		url:'/ClasesMatriculadas',
		method:'POST',
		dataType:"json",
		success:function (respuesta) {
			console.log(respuesta);
			$("#clasesCalificaciones").html('');
			for (var i = 0; i < respuesta.length; i++) {
				var obs='RPB';
				if(respuesta[i].PROMEDIO>=65){
					obs='APR';
				}
				$("#clasesCalificaciones").append('<tr>'+
                  '<td>'+respuesta[i].CODIGO_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].CANTIDAD_UNIDADES_VALORATIVAS+'</td>'+
                  '<td>'+respuesta[i].HORA_INICIO+'</td>'+
                  '<td>'+respuesta[i].PROMEDIO+'</td>'+
                  '<td>'+obs+'</td>'+
               	'</tr>');
			}
		},
		error:function (error) {
			alert('Error al cargar clases calificaciones');
		}
	});
}

function CargarClasesEliminar() {
	$.ajax({
		url:'/clasesMatriculadas',
		method:'POST',
		dataType:"json",
		success:function (respuesta) {
			$("#clasesEliminar").html('');
			for (var i = 0; i < respuesta.length; i++) {
				$("#clasesEliminar").append('<tr>'+
                  '<td>'+respuesta[i].CODIGO_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].HORA_INICIO+'</td>'+
                  '<td>'+respuesta[i].HORA_INICIO+'</td>'+
                  '<td>'+respuesta[i].HORA_FIN+'</td>'+
                  '<td>'+respuesta[i].DIAS+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_EDIFICIO+'</td>'+
                  '<td>'+respuesta[i].NUMERO_AULA+'</td>'+
                  '<td>'+respuesta[i].CANTIDAD_UNIDADES_VALORATIVAS+'</td>'+
                  '<td><button type="button" class="btn btn-danger" onclick="Eliminar('+respuesta[i].CODIGO__HISTORIAL+');"><i class="fas fa-times"></i></button></td>'+
               	'</tr>');
			}
		},
		error:function (error) {
			alert('Error al cargar clases a eliminar');
		}
	});
}

function Eliminar(codigo) {
	$.ajax({
		url:'/Eliminar',
		method:'POST',
		data:'id='+codigo,
		dataType:"json",
		success:function (respuesta) {
			alert('Clase Eliminada');
			CargarClasesEliminar();
		},
		error:function (error) {
			alert('Error al Eliminar clase');
		}
	});
}