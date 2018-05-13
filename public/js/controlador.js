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
			method: 'POST',
			data: 'valor='+valor+'&codigo='+codigo+'&pass='+pass,
			dataType:"json",
			success:function(respuesta){
				if(respuesta.estatus==0){
					$(location).attr('href',"../home.html");
				}else{
					$("#inputCuentaLogin").addClass('is-invalid');
					$("#inputPasswordLogin").addClass('is-invalid');
				}
			}
		});
	}
	
});

