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
    let rpe = datosUsuario.RPE;

    //Obtener motivos
    ObtenerMotivos(rpe);


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


    $('#btnAgregarComida').on('click', function () {
        GenerarVistaPreviaRegistros();
    });

    $('#tablaConceptosBody').on('click', '.btn-eliminar', function () {
        EliminarFilaDeVistaPrevia(this);
    });

    $('#btnGenerar').on('click', function () {
        GenerarReporteAlimentos();
    });

});

let alimentos = [];

function ObtenerMotivos(rpe) {
    $.ajax({
        url: '../backend/Obtener_Motivos.php',
        type: 'GET',
        dataType: 'json',
        data: { 
            rpe: rpe 
        }, 
        success: function (response) {
            if (response.Result == 1) {
                let select = $('#motivo');
                select.empty().append('<option value="">Seleccione...</option>');
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
        <tr data-index="${alimentos.length - 1}">
            <td>${nuevoRegistro.fecha}</td>
            <td>${nuevoRegistro.horario}</td>
            <td>${nuevoRegistro.desayuno}</td>
            <td>${nuevoRegistro.comida}</td>
            <td>${nuevoRegistro.cena}</td>
            <td>${nuevoRegistro.actividades}</td>
            <td><button class="btn-eliminar"><img src="Images/borrar.png" alt="Eliminar"></button></td>
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

function EliminarFilaDeVistaPrevia(boton) {
    const fila = $(boton).closest('tr');
    const index = fila.data('index');


    alimentos.splice(index, 1);

    fila.remove();

    $('#tablaConceptosBody tr').each(function (i) {
        $(this).attr('data-index', i);
    });

    if (alimentos.length === 0) {
        $('#vista-previa-tabla').hide();
    }

    AlertaCustom("Registro eliminado.", 2000, "success");
}


function GenerarReporteAlimentos() {
    if (alimentos.length === 0) {
        AlertaCustom("No hay registros para generar el reporte.", 3000, "error");
        return;
    }

    let datosUsuario = JSON.parse(sessionStorage.getItem('usuario'));
    if (!datosUsuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html";
        return;
    }

    const reporteData = {
        empleado: {
            nombre: `${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`,
            rpe: datosUsuario.RPE,
            puesto: datosUsuario.Puesto
        },
        alimentos: alimentos
    };

    sessionStorage.setItem('reporteAlimentos', JSON.stringify(reporteData));

    window.open('../Templates/Reporte_Alimentos.html', '_blank');
}