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
            alert('Por favor rellena todos los datos.');
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
