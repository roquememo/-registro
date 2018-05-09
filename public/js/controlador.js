$(document).ready(function() {

	 $('#slc-categoria').unbind('change').bind('change', function (e){
    	var valor =$('#slc-categoria').val();
   		if(valor==1){
   			$("#inputCuentaLogin").attr("placeholder","Numero de cuenta");
   		}else if(valor==2){
   			$("#inputCuentaLogin").attr("placeholder","Numero de empleado");
   		}else{
   			$("#inputCuentaLogin").attr("placeholder","Numero de empleado");
   		}
  });

	var c=false;
	$(window).scroll(function() {
	  	if($(document).scrollTop() > 100) {
	  		if (!c) {
	    		$('#menu').addClass('navbar-dark');
	    		$('#menu').addClass('bg-dark');
	    		$('#logo').attr('src','img/unah1.png');
	    		c=true;
	    	}	
	    }
	    else {
	    	if (c) {
	    		$('#menu').removeClass('navbar-dark');
	    		$('#menu').removeClass('bg-dark');
	    		$('#logo').attr('src','img/unah.png');
	    		c=false;
	    	}
	    }
  	});

});



$("#btnEntrar").click(function () {
	var codigo=$("#inputCuentaLogin").val();
	var pass=$("#inputPasswordLogin").val();
	var valor=$("#slc-categoria").val();
	if(codigo=='' || pass==''){
		$("#inputCuentaLogin").addClass('is-invalid');
		$("#inputPasswordLogin").addClass('is-invalid');
	}else{
		$.ajax({
			url: '/login',
			method: 'GET',
			data: 'valor='+valor+'&codigo='+codigo+'&pass='+pass,
			success:function(respuesta){
				if(respuesta=='entro'){
					if(valor==1){
						$(location).attr('href',"alumno/index.html");
					}else if($("#slc-categoria").val()==2){
						$(location).attr('href',"profesor/index.html");
					}else{
						$(location).attr('href',"administrador/index.html");
					}
				}
			}
		});
	}
	
});

function editarNota() {
	$("#blockView").addClass('active');
	$("#listView").removeClass('active');
}

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
	if(valor==0){
		$("#formulario1").removeClass('active');
		$("#formulario2").addClass('active');
	}else if(valor==1){
		$("#formulario1").addClass('active');
		$("#formulario2").removeClass('active');
	}else if(valor==2){
		$("#formulario3").addClass('active');
		$("#formulario2").removeClass('active');
	}else if(valor==3){
		$("#formulario2").addClass('active');
		$("#formulario3").removeClass('active');
	}else{
		alert("registro");
	}
}

