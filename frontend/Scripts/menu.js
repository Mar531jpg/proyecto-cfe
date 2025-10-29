$(document).ready(function() {

    let datosUsuario = JSON.parse(sessionStorage.getItem('usuario'));

    if(!datosUsuario){
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html";
        return;
    }

    $('#empleado').val(`${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`);
    $('#puesto').val(datosUsuario.Puesto);

    let hoy = new Date().toISOString().split('T')[0];
    $('#fecha').attr('max', hoy);

    $.ajax({
        url: '../backend/Obtener_Motivos.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if(response.Result == 1){
                let select = $('#motivo');
                response.Motivos.forEach(m => {
                    select.append(`<option value="${m.Id}">${m.Nombre}</option>`);
                });
            } else {
                alert('No se pudieron cargar los motivos.');
            }
        },
        error: function() {
            alert('Error al conectar con el servidor para obtener los motivos.');
        }
    });

    window.mostrar = function(id) {
        $('section').removeClass('active');
        $('#' + id).addClass('active');

        $('nav a').removeClass('active');
        event.target.classList.add('active');
    }

     $("#btnGenerar").click(function() {
        const empleado = $("#empleado").val().trim();
        const puesto = $("#puesto").val().trim();
        const motivo = $("#motivo option:selected").text();
        const fecha = $("#fecha").val();

        if (empleado === "" || motivo === "" || fecha === "") {
            alert("Completa todos los campos antes de generar el formato.");
            return;
        }

        
    });
    
    // Detectar cambio en el select de motivos
    $('#motivo').change(function() {
        const motivoId = $(this).val(); // Obtiene el valor seleccionado
        if (motivoId === "3") {
            // Mostrar y habilitar los campos
            $('#comidasSeccion').show();
            $('#comidasSeccion input, #comidasSeccion textarea').prop('disabled', false);
        } else {
            // Ocultar y deshabilitar los campos si es otro motivo
            $('#comidasSeccion').hide();
            $('#comidasSeccion input, #comidasSeccion textarea').prop('disabled', true).val('');
        }
    });


});
