$(document).ready(function() {

    // Traer datos del usuario desde sessionStorage
    let datosUsuario = JSON.parse(sessionStorage.getItem('usuario'));

    if(!datosUsuario){
        // Si no hay datos, regresar al login
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html";
        return;
    }

    // Rellenar el formulario
    $('#empleado').val(`${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`);
    $('#puesto').val(datosUsuario.Puesto);
    
    // Fecha máxima
    let hoy = new Date().toISOString().split('T')[0];
    $('#fecha').attr('max', hoy);

    // Función para cambiar secciones
    window.mostrar = function(id) {
        $('section').removeClass('active');
        $('#' + id).addClass('active');

        $('nav a').removeClass('active');
        event.target.classList.add('active');
    }

});
