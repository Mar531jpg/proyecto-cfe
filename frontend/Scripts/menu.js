$(document).ready(function () {

    let datosUsuario = JSON.parse(sessionStorage.getItem('usuario'));

    //Validar inicio sesión
    if (!datosUsuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html";
        return;
    }

    //Autorellenar campos de nombre y puesto
    $('#empleado').val(`${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`);
    $('#puesto').val(datosUsuario.Puesto);

    //Obtener motivos
    ObtenerMotivos();


    window.mostrar = function (id) {
        $('section').removeClass('active');
        $('#' + id).addClass('active');

        $('nav a').removeClass('active');
        event.target.classList.add('active');
    }

    //Validar fecha hasta hoy
    let hoy = new Date().toISOString().split('T')[0];
    $('#fechaRealizada').attr('max', hoy);


    //Activar la sección de comidas cuando motivo == 3
    $('#motivo').change(function () {
        const motivoId = $(this).val();

        ActivarSecciones(motivoId);
    });

    // Lista de alimentos global
   
    $('#btnAgregarComida').on('click', function () {
        GenerarVistaPreviaRegistros();
    });


});


function ObtenerMotivos() {
    $.ajax({
        url: '../backend/Obtener_Motivos.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.Result == 1) {
                let select = $('#motivo');
                response.Motivos.forEach(m => {
                    select.append(`<option value="${m.Id}">${m.Nombre}</option>`);
                });
            } else {
                alert('No se pudieron cargar los motivos.');
            }
        },
        error: function () {
            alert('Error al conectar con el servidor para obtener los motivos.');
        }
    });
}

function ActivarSecciones(motivoId) {
    if (motivoId === "3") {
        $('#comidasSeccion').show();
        $('#comidasSeccion input, #comidasSeccion textarea').prop('disabled', false);
    } else {
        $('#comidasSeccion').hide();
        $('#comidasSeccion input, #comidasSeccion textarea').prop('disabled', true).val('');
    }
}

function GenerarVistaPreviaRegistros() {
    let alimentos = [];

    const desayuno = parseFloat($('#precioDesayuno').val()) || 0;
    const comida = parseFloat($('#precioComida').val()) || 0;
    const cena = parseFloat($('#precioCena').val()) || 0;
    const descripcion = $('#descripcionActividades').val().trim();
    const fecha = $('#fechaRealizada').val();
    const horaInicio = $('#horaInicio').val();
    const horaFin = $('#horaFin').val();

    if (!fecha || !horaInicio || !horaFin || descripcion === "") {
        AlertaCustom("Por favor, llena todos los campos obligatorios.", 3000, "error");
        return;
    }

    if (desayuno <= 0 && comida <= 0 && cena <= 0) {
        AlertaCustom("Debes ingresar al menos un monto en desayuno, comida o cena.", 3000, "error");
        return;
    }

    const nuevoRegistro = {
        fecha,
        horario: `${horaInicio} - ${horaFin}`,
        desayuno: `$${desayuno.toFixed(2)}`,
        comida: `$${comida.toFixed(2)}`,
        cena: `$${cena.toFixed(2)}`,
        actividades: descripcion
    };

    alimentos.push(nuevoRegistro);

    $('#vista-previa-tabla').show();

    const fila = `
        <tr>
            <td>${nuevoRegistro.fecha}</td>
            <td>${nuevoRegistro.horario}</td>
            <td>${nuevoRegistro.desayuno}</td>
            <td>${nuevoRegistro.comida}</td>
            <td>${nuevoRegistro.cena}</td>
            <td>${nuevoRegistro.actividades}</td>
        </tr>
        `;
    $('#tablaConceptosBody').append(fila);

    $('#precioDesayuno, #precioComida, #precioCena').val('');
    $('#descripcionActividades').val('');
    $('#fechaRealizada').val('');
    $('#horaInicio').val('');
    $('#horaFin').val('');

    AlertaCustom("Registro agregado correctamente.", 2000, "success");
}