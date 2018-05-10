$(document).ready(function () {
	$.ajax({
		url:'/obtenerClasesProfesor',
		method: 'POST',
		dataType: 'json',
		success:function (respuesta) { 
			$('#claseshome').html('');
			$('#clasesSelect').html('<option selected>Seleccione una clase...</option>');
			for (var i = 0; i < respuesta.length; i++) {
				$('#claseshome').append('<tr>'+
                  '<th scope="row">'+(i+1)+'</th>'+
                  '<td>'+respuesta[i].NOMBRE_ASIGNATURA+'</td>'+
                  '<td>'+respuesta[i].HORA_INICIO+'</td>'+
                '</tr>');
                $('#clasesSelect').append('<option value="'+respuesta[i].CODIGO_SECCION+'">'+respuesta[i].NOMBRE_ASIGNATURA+'</option>');
			}
			
		},
		error:function () {
			alert('Error al cargar clases del profesor');
		}
	});

	$('#clasesSelect').unbind('change').bind('change', function (e){
    	var valor =$('#clasesSelect').val();
    		$.ajax({
				url:'/obtenerSeccionProfesor',
				method: 'POST',
				data: 'id='+valor,
				dataType: 'json',
				success:function (respuesta) { 
					$('#clasesMostrar').html('<tr>'+
                      '<th scope="row">Codigo</th>'+
                      '<td>'+respuesta[0].CODIGO_ASIGNATURA+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<th scope="row">Nombre</th>'+
                      '<td>'+respuesta[0].NOMBRE_ASIGNATURA+'</td>'+
                   ' </tr>'+
                    '<tr>'+
                      '<th scope="row">Seccion</th>'+
                      '<td>'+respuesta[0].HORA_INICIO+'</td>'+
                    '</tr>');
                    obtenerAlumnosSeccion(respuesta[0].CODIGO_SECCION);
				},
				error:function () {
					alert('Error al cargar secciones');
				}
			});
   		
  });

});


function obtenerInfo() {
	$.ajax({
		url:'/obtenerValoresProfesor',
		method: 'POST',
		dataType: 'json',
		success:function (respuesta) { 
			$('#valoresProfesor').html('');
			$('#valoresProfesor').html('<tr>'+
                      '<th scope="row">Nombre</th>'+
                      '<td>'+respuesta[0].NOMBRE+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<th scope="row">Apellido</th>'+
                      '<td>'+respuesta[0].APELLIDO+'</td>'+
                   ' </tr>'+
                    '<tr>'+
                      '<th scope="row">Numero de empleado</th>'+
                      '<td>'+respuesta[0].NUMERO_EMPLEADO+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<th scope="row">Facultad</th>'+
                      '<td>'+respuesta[0].NOMBRE_FACULTAD+'</td>'+
                    '</tr>');
		},
		error:function () {
			alert('Error al cargar info del profesor');
		}
	});
}

function obtenerAlumnosSeccion(id) {
			$.ajax({
				url:'/obtenerAlumnosSeccion',
				method: 'POST',
				data: 'id='+id,
				dataType: 'json',
				success:function (respuesta) { 
					$('#AlumnosSeccion').html('');
					for (var i = 0; i < respuesta.length; i++){
						var nombre = "'"+respuesta[i].NOMBRE+" "+respuesta[i].APELLIDO+"'";
						var cuenta=respuesta[i].NUMERO_CUENTA;
						var historial=respuesta[i].CODIGO__HISTORIAL;
					 	$('#AlumnosSeccion').append('<tr><td>'+respuesta[i].NUMERO_CUENTA+'</td>'+
                  		'<td>'+respuesta[i].NOMBRE+' '+respuesta[i].APELLIDO+'</td>'+
                  		'<td>'+respuesta[i].PROMEDIO+'</td>'+
                  		'<td><button onclick="editarNota('+historial+','+cuenta+','+nombre+')" type="button" class="btn btn-info"><i class="far fa-edit"></i></button></td>'+
                		'</tr>');
					 } 
				},
				error:function () {
					alert('Error al cargar secciones');
				}
			});
}

function editarNota(historial,cuenta,nombre) {
	$("#blockView").addClass('active');
	$("#listView").removeClass('active');
	$('#cuenta_alumno_nota').attr('value',cuenta);
	$('#nombre_alumno_nota').attr('value',nombre);
	$('#historial_alumno').attr('value',historial);
}

$('#asignarNota').click(function () {
	var nota=$('#nota_alumno').val();
	var valor =$('#clasesSelect').val();
	var historial = $('#historial_alumno').val();
	if(nota!=''){
		$.ajax({
				url:'/asignarNota',
				method: 'POST',
				data: 'nota='+nota+'&id='+historial,
				dataType: 'json',
				success:function (respuesta) { 
					alert('Nota Asignada');
					$("#blockView").removeClass('active');
					$("#listView").addClass('active');
					obtenerAlumnosSeccion(valor);
					$('#nota_alumno').val('');
				},
				error:function () {
					alert('Error al asignar notas');
				}
			});
	}
});
