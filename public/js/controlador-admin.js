$(document).ready(function () {

	$.ajax({
		url:'/obtenerCarreras',
		method: 'POST',
		dataType: 'json',
		success:function (respuesta) {
			$('#SelectCarrera').html('<option selected>Carrera...</option>');
			for (var i = 0; i < respuesta.length; i++) {
				$('#SelectCarrera').append('<option value="'+respuesta[i].CODIGO_CARRERA+'">'+respuesta[i].NOMBRE_CARRERA+'</option>');
			}
		},
		error:function () {
			alert('error al cargar carreras');
		}
	});

	$.ajax({
		url:'/obtenerFacultades',
		method: 'POST',
		dataType: 'json',
		success:function (respuesta) {
			$('#SelectFacultad').html('<option selected>Facultad...</option>');
			for (var i = 0; i < respuesta.length; i++) {
				$('#SelectFacultad').append('<option value="'+respuesta[i].CODIGO_FACULTAD+'">'+respuesta[i].NOMBRE_FACULTAD+'</option>');
			}
		},
		error:function () {
			alert('error al cargar carreras');
		}
	});
	
});


function efecto(valor) {
	if(valor==1){
		$("#blockView").removeClass('active');
		$("#listView").addClass('active');
	}else{
		$("#blockView").addClass('active');
		$("#listView").removeClass('active');
	}
}

function formu(valor) {
		var nombre=$('#InputNombre').val();
		var apellido=$('#InputApellido').val();
		var email=$('#InputEmail').val();
		var tipoidentificacion=$('#SelectIdentidicacion').val();
		var identificacion=$('#InputIdentificacion').val();
		var date=$('#InputDate').val();
		var ciudad=$('#SelectCiudad').val();
		var colonia=$('#InputColonia').val();
		var telefono=$('#InputTelefono').val();
		var carrera=$('#SelectCarrera').val();
		var cuenta=$('#InputCuenta').val();
		var confirmarcuenta=$('#ConfirmarCuenta').val();
		var password=$('#InputPassword').val();
		var confirmarpassword=$('#ConfirmarPassword').val();
		var selectSexo=$('#SelectSexo').val();
		var parametros='nombre='+nombre+'&apellido='+apellido+'&email='+email+'&tipoidentificacion='+tipoidentificacion+
						'&identificacion='+identificacion+'&date='+date+'&ciudad='+ciudad+'&colonia='+colonia+
						'&telefono='+telefono+'&carrera='+carrera+'&cuenta='+cuenta+'&password='+password+
						'&selectSexo='+selectSexo;
	if(valor==0){
		if(nombre=='' || apellido=='' || selectSexo=='' || email=='' || tipoidentificacion=='' || identificacion=='' || date==''){
			$('#error').html('Debe llenar todos los datos');
		}else{
			$("#formulario1").removeClass('active');
			$("#formulario2").addClass('active');
			$('#error').html('');
		}
	}else if(valor==1){
		$("#formulario1").addClass('active');
		$("#formulario2").removeClass('active');
	}else if(valor==2){
		
		if(ciudad=='' || colonia=='' || telefono==''){
			$('#error').html('Debe llenar todos los datos');
		}else{
			$("#formulario3").addClass('active');
			$("#formulario2").removeClass('active');
			$('#error').html('');
		}
	}else if(valor==3){
		$("#formulario2").addClass('active');
		$("#formulario3").removeClass('active');
	}else if(valor==4){
		if(carrera=='' || cuenta=='' || confirmarcuenta=='' || password=='' || confirmarpassword==''){
			$('#error').html('Debe llenar todos los datos');
		}else{
			if((cuenta!=confirmarcuenta)){
				$('#error').html('Las cuentas no coinciden');
			}else if(password!=confirmarpassword){
				$('#error').html('las password coinciden');
			}else{
				$.ajax({
					url:'/agregarAlumno',
					method: 'POST',
					data: parametros,
					dataType:'json',
					success:function (respuesta) {
						$('#error').html('');
						alert('registro agregado');
						CargarAlumnosTotales();
					},
					error:function (error) {
						alert('error al agregar alumno');
					}
				});
			}
		}
	}
}




function formu1(valor) {
		var nombre=$('#InputNombre').val();
		var apellido=$('#InputApellido').val();
		var email=$('#InputEmail').val();
		var tipoidentificacion=$('#SelectIdentidicacion').val();
		var identificacion=$('#InputIdentificacion').val();
		var date=$('#InputDate').val();
		var ciudad=$('#SelectCiudad').val();
		var colonia=$('#InputColonia').val();
		var telefono=$('#InputTelefono').val();
		var facultad=$('#SelectFacultad').val();
		var numero=$('#Inputnumero').val();
		var confirmarnumero=$('#Confirmarnumero').val();
		var password=$('#InputPassword').val();
		var confirmarpassword=$('#ConfirmarPassword').val();
		var selectSexo=$('#SelectSexo').val();
		var parametros='nombre='+nombre+'&apellido='+apellido+'&email='+email+'&tipoidentificacion='+tipoidentificacion+
						'&identificacion='+identificacion+'&date='+date+'&ciudad='+ciudad+'&colonia='+colonia+
						'&telefono='+telefono+'&facultad='+facultad+'&numero='+numero+'&password='+password+
						'&selectSexo='+selectSexo;
	if(valor==0){
		if(nombre=='' || apellido=='' || selectSexo=='' || email=='' || tipoidentificacion=='' || identificacion=='' || date==''){
			$('#error').html('Debe llenar todos los datos');
		}else{
			$("#formulario1").removeClass('active');
			$("#formulario2").addClass('active');
			$('#error').html('');
		}
	}else if(valor==1){
		$("#formulario1").addClass('active');
		$("#formulario2").removeClass('active');
	}else if(valor==2){
		
		if(ciudad=='' || colonia=='' || telefono==''){
			$('#error').html('Debe llenar todos los datos');
		}else{
			$("#formulario3").addClass('active');
			$("#formulario2").removeClass('active');
			$('#error').html('');
		}
	}else if(valor==3){
		$("#formulario2").addClass('active');
		$("#formulario3").removeClass('active');
	}else if(valor==4){
		if(facultad=='' || numero=='' || confirmarnumero=='' || password=='' || confirmarpassword==''){
			$('#error').html('Debe llenar todos los datos');
		}else{
			if((numero!=confirmarnumero)){
				$('#error').html('Las numeros no coinciden');
			}else if(password!=confirmarpassword){
				$('#error').html('las password coinciden');
			}else{
				$.ajax({
					url:'/agregarProfesor',
					method: 'POST',
					data: parametros,
					dataType:'json',
					success:function (respuesta) {
						$('#error').html('');
						alert('registro agregado');
						CargarProfesoresTotales();
					},
					error:function (error) {
						alert('error al agregar Profesor');
					}
				});
			}
		}
	}
}


function CargarProfesoresTotales() {
	$.ajax({
		url: '/CargarProfesoresTotales',
		method: 'POST',
		dataType: 'json',
		success:function (respuesta) {
			$('#profesores').html('');
			for (var i = 0; i < respuesta.length; i++) {
				$('#profesores').append('<tr>'+
                  '<td>'+respuesta[i].CODIGO_EMPLEADO+'</td>'+
                  '<td>'+respuesta[i].NOMBRE+' '+respuesta[i].APELLIDO+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_FACULTAD+'</td>'+
                '</tr>');
			}
		},
		error:function () {
			alert('Error al cargar profesores');
		}
	});
}


function CargarAlumnosTotales() {
	$.ajax({
		url: '/CargarAlumnosTotales',
		method: 'POST',
		dataType: 'json',
		success:function (respuesta) {
			$('#alumnos').html('');
			for (var i = 0; i < respuesta.length; i++) {
				$('#alumnos').append('<tr>'+
                  '<td>'+respuesta[i].NUMERO_CUENTA+'</td>'+
                  '<td>'+respuesta[i].NOMBRE+' '+respuesta[i].APELLIDO+'</td>'+
                  '<td>'+respuesta[i].NOMBRE_CARRERA+'</td>'+
                '</tr>');
			}
		},
		error:function () {
			alert('Error al cargar alumnos');
		}
	});
}