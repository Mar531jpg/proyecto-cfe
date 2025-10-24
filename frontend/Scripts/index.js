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

        let rpa = $('#usuario').val().trim();
        let password = $('#contrasena').val().trim();

        if(rpa === '' || password === ''){
            alert('Por favor rellena todos los datos.');
            return;
        }

        $.ajax({
            url: '../backend/login.php',
            type: 'POST',
            dataType: 'json',
            data: { rpa: rpa, password: password },
            success: function(response) {
                if(response.Result == 1){
                    window.location.href = "menu.html";
                } else {
                    alert(response.Message);
                }
            },
            error: function(error) {
                alert('Error en la conexión con el servidor.');
                console.log('error ', error)
            }
        });
    });

});
