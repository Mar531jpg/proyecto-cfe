$(document).ready(function() {

    $('#toggleContrasena').on('click', function() {
        const input = $('#contrasena');
        const icono = $('#toggleContrasena');
        
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icono.attr('src', 'Images/Ver.png');
            icono.attr('alt', 'Ocultar contraseña');
        } else {
            input.attr('type', 'password');
            icono.attr('src', 'Images/NoVer.png');
            icono.attr('alt', 'Mostrar contraseña');
        }
    });

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        let rpe = $('#RPE').val().trim();
        let password = $('#contrasena').val().trim();

        if(rpe === '' || password === ''){
             AlertaCustom("Por favor rellena todos los datos.", 3000, "error");
            return;
        }

        $.ajax({
            url: '../backend/login.php',
            type: 'POST',
            dataType: 'json',
            data: { rpe: rpe, password: password },
            success: function(response) {
                if(response.Result == 1){
                    
                    sessionStorage.setItem('usuario', JSON.stringify(response.Datos));
 
                    window.location.href = "menu.html";
                }
                else {
                     AlertaCustom(response.Message, 3000, "error");
                }
            },
            error: function(error) {
                 AlertaCustom("Error en la conexión del servidor.", 3000, "error");
                console.log('error ', error)
            }
        });
    });

});
