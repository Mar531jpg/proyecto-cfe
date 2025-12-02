$(document).ready(function () {
    
    let datosUsuario = JSON.parse(sessionStorage.getItem('usuario'));


    //Validar inicio sesión
    if (!datosUsuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html";
        return;
    }

    if (datosUsuario.Catalogo_Puestos !== "Confianza") {
        $("#tabUsuarios").hide();
    }

    $('#empleado').val(`${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`);
    $('#puesto').val(datosUsuario.Puesto);
    let rpe = datosUsuario.RPE;

    ObtenerMotivos(rpe);

    $('#btnCerrarSesion').on('click', function () {
        if (!confirm("¿Deseas cerrar sesión?")) return;


        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('reporteAlimentos');



        window.location.href = "index.html";
    });



    window.mostrar = function (id, event) {

        $('section').removeClass('active');
        $('#' + id).addClass('active');

        $('nav a').removeClass('active');

        if (event) {
            event.target.classList.add('active');
        }

        if (id === 'usuarios') {
            $('.container').hide();
            CargarUsuarios();
        } else {
            $('.container').show();
        }
    };



    let hoy = new Date().toISOString().split('T')[0];
    $('#fechaRealizada').attr('max', hoy);


    $('#motivo').change(function () {
        const motivoId = $(this).val();

        ActivarSecciones(motivoId);
    });


    $('#btnAgregarComida').on('click', function () {
        GenerarVistaPreviaRegistros();
    });

     $('#btnAgregarHoraExtra').on('click', function () {
        GenerarRegistroHorasExtra();
    });

    $('#btnVerVistaPrevia').on('click', function () {
        abrirModalVistaPrevia();
    });

    $('#btnVerRegistrosHE').on('click', function () {
        abrirModalVistaPreviaHorasExtra();
    });

    
    $(document).on('click', '#tablaModalBody .btn-eliminar', function() {
        EliminarFilaDeVistaPrevia(this);
    });

    $('#btnGenerar').on('click', function () {
        GenerarReporteAlimentos();
    });

    $('#btnGenerarFormatoHE').on('click', function () {
        GenerarReporteHorasExtra();
    });



    $('#btnCerrarModal').on('click', function () {
        $('#modalUsuario').fadeOut(200);
    });

    $('#btnNuevoUsuario').on('click', function () {
        AbrirModalUsuario("Nuevo");
    });

    $("#btnCerrarModalVistaPrevia").click(function() {
        $("#modalVistaPrevia").hide();
    });

    $('#btnGuardarUsuario').on('click', function () {

        let accion = $('#modalUsuario').data('accion');

        let idPuesto = $('#puestoUsuario').val();
        if (!idPuesto) {
            AlertaCustom("Debes seleccionar un puesto.", 3000, "error");
            return;
        }

        let datos = {
            Id: $('#usuarioId').val(),
            Nombre: $('#nombreUsuario').val().trim(),
            ApellidoPaterno: $('#apellidoPUsuario').val().trim(),
            ApellidoMaterno: $('#apellidoMUsuario').val().trim(),
            RPE: $('#rpeUsuario').val().trim(),
            Activo: $('#activoUsuario').val(),
            IdPuesto: idPuesto
        };

        $.ajax({
            url: '../backend/Guardar_Usuario.php',
            type: 'POST',
            dataType: 'json',
            data: { accion: accion, datos: datos },
            success: function (response) {
                if (response.Result == 1) {
                    AlertaCustom(response.Message, 3000, "success");
                    $('#modalUsuario').fadeOut(200);
                    CargarUsuarios();
                } else {
                    AlertaCustom(response.Message, 3000, "error");
                }
            }
        });

    });

});

let alimentos = [];
let motivoActivo = null; 


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

    // Si cambia el motivo, reinicia registros
    if (motivoId !== motivoActivo) {
        alimentos = [];     // tu lista global
        sessionStorage.removeItem('reporteAlimentos');
        motivoActivo = motivoId;
        console.log("Motivo cambiado. Registros reiniciados.");
    }

    const secciones = [
        '#comidasSeccion',
        '#formularioHorasExtra'
    ];

    secciones.forEach(id => {
        $(id).hide();
        $(`${id} input, ${id} textarea, ${id} select`)
            .prop('disabled', true)
            .val('');
    });

    if (motivoId === "3") {
        $('#comidasSeccion').show();
        $('#comidasSeccion input, #comidasSeccion textarea, #comidasSeccion select')
            .prop('disabled', false);
        return;
    }

    if (motivoId === "1") {
        $('#formularioHorasExtra').show();
        $('#formularioHorasExtra input, #formularioHorasExtra textarea, #formularioHorasExtra select')
            .prop('disabled', false);
        return;
    }
}



function EliminarFilaDeVistaPrevia(boton) {
    const fila = $(boton).closest('tr');
    const index = fila.data('index');

    if (index === undefined) return;

    alimentos.splice(index, 1);

    fila.remove();

    $("#tablaModalBody tr").each(function(i) {
        $(this).attr("data-index", i);
    });

    if (alimentos.length === 0) {
        $("#tablaModalConceptos").hide();
        $("#mensajeSinDatos").show();
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

    const primaDominical = $('#chkPrimaDominical').is(':checked');
    const festivoTrabajado = $('#chkFestivoTrabajado').is(':checked');
    const otroConcepto = $('#chkOtroConcepto').is(':checked');

    const reporteData = {
        empleado: {
            nombre: `${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`,
            rpe: datosUsuario.RPE,
            puesto: datosUsuario.Puesto
        },
        alimentos: alimentos, 
        globales: {        
            primaDominical,
            festivoTrabajado,
            otroConcepto
        }
    };

    sessionStorage.setItem('reporteAlimentos', JSON.stringify(reporteData));

    window.open('../Templates/Reporte_Alimentos.html', '_blank');
}

function CargarUsuarios() {
    $.ajax({
        url: '../backend/Obtener_Usuarios.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {

            if (response.Result == 1) {
                const tbody = $('#tablaUsuariosBody');
                tbody.empty();

                response.Usuarios.forEach(u => {
                    const fila = `
                        <tr>
                            <td>${u.Nombre}</td>
                            <td>${u.ApellidoPaterno}</td>
                            <td>${u.ApellidoMaterno}</td>
                            <td>${u.RPE}</td>
                            <td>${u.Activo == 1 ? 'Sí' : 'No'}</td>
                            <td style="text-align: center; display: flex; justify-content: center; gap: 10px;">
                                <button class="btn-accion btnEditar" data-id="${u.Id}" title="Editar">
                                    <img src="Images/editar.png" alt="Editar" class="icono-accion">
                                </button>
                                <button class="btn-accion btnEliminar" data-id="${u.Id}" title="Eliminar">
                                    <img src="Images/borrar.png" alt="Eliminar" class="icono-accion">
                                </button>
                                <button class="btn-accion btnEditarContrasena" data-id="${u.Id}" title="Editar contraseña">
                                    <img src="Images/Contrasena.png" alt="Editar contraseña" class="icono-accion">
                                </button>
                            </td>
                        </tr>
                    `;
                    tbody.append(fila);
                });




                $('.btnEditar').on('click', function () {
                    let id = $(this).data('id');

                    let usuario = response.Usuarios.find(u => u.Id == id);

                    AbrirModalUsuario("Editar", usuario);
                });

                $('#tablaUsuariosBody').on('click', '.btnEliminar', function () {
                    let id = $(this).data('id');

                    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

                    $.ajax({
                        url: '../backend/Eliminar_Usuario.php',
                        type: 'POST',
                        dataType: 'json',
                        data: { id: id },
                        success: function (response) {
                            if (response.Result == 1) {
                                AlertaCustom(response.Message, 3000, "success");
                                CargarUsuarios();
                            } else {
                                AlertaCustom(response.Message, 3000, "error");
                            }
                        },
                        error: function () {
                            AlertaCustom("Error al conectar con el servidor.", 3000, "error");
                        }
                    });
                });

                // Abrir modal de editar contraseña
                $('#tablaUsuariosBody').on('click', '.btnEditarContrasena', function () {
                    let id = $(this).data('id');
                    $('#usuarioIdContrasena').val(id);
                    $('#camposContrasena').empty();

                    // Consultar si tiene contraseña
                    $.ajax({
                        url: '../backend/Obtener_Contrasena.php',
                        type: 'GET',
                        dataType: 'json',
                        data: { Id: id },
                        success: function (response) {
                            if (response.Result == 1) {
                                if (response.Contrasena) {
                                    $('#camposContrasena').append(`
                                        <label>Contraseña actual:</label>
                                        <input type="password" id="contrasenaActual">
                                        <label>Nueva contraseña:</label>
                                        <input type="password" id="nuevaContrasena">
                                        <div id="errorContrasena" style="color:red; margin-top:5px;"></div>
                                    `);
                                } else {
                                    $('#camposContrasena').append(`
                                        <label>Nueva contraseña:</label>
                                        <input type="password" id="nuevaContrasena">
                                        <div id="errorContrasena" style="color:red; margin-top:5px;"></div>
                                    `);
                                }
                                $('#modalContrasena').fadeIn(200);
                            } else {
                                AlertaCustom(response.Message, 3000, "error");
                            }
                        },
                        error: function () {
                            AlertaCustom("Error al conectar con el servidor.", 3000, "error");
                        }
                    });
                });

                // Guardar contraseña
                $('#btnGuardarContrasena').on('click', function () {
                    let id = $('#usuarioIdContrasena').val();
                    let contrasenaActual = $('#contrasenaActual').val() || null;
                    let nuevaContrasena = $('#nuevaContrasena').val();

                    if (!nuevaContrasena) {
                        $('#errorContrasena').text("Debes escribir la nueva contraseña.");
                        return;
                    }

                    $.ajax({
                        url: '../backend/Guardar_Contrasena.php',
                        type: 'POST',
                        dataType: 'json',
                        data: { Id: id, contrasenaActual, nuevaContrasena },
                        success: function (response) {
                            if (response.Result == 1) {
                                AlertaCustom(response.Message, 3000, "success");
                                $('#modalContrasena').fadeOut(200);
                            } else {
                                $('#errorContrasena').text(response.Message);
                            }
                        },
                        error: function () {
                            $('#errorContrasena').text("Error al conectar con el servidor.");
                        }
                    });
                });


                $('#btnCerrarModalContrasena').on('click', function () {
                    $('#modalContrasena').fadeOut(200);
                });



            }
        }
    });
}

function AbrirModalUsuario(accion, usuario = null) {

    $('#modalTitulo').text(accion + " Usuario");
    $('#modalUsuario').data('accion', accion);

    let selectPuestos = $('#puestoUsuario');
    selectPuestos.empty().append('<option value="">Seleccione un puesto...</option>');

    $.ajax({
        url: '../backend/Obtener_Puestos.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.Result == 1) {
                response.Puestos.forEach(p => {
                    selectPuestos.append(`<option value="${p.Id}">${p.Nombre}</option>`);
                });

                if (accion === "Editar" && usuario) {
                    selectPuestos.val(usuario.IdPuesto || '');
                }
            } else {
                AlertaCustom(response.Message, 3000, "error");
            }
        },
        error: function () {
            AlertaCustom("Error al obtener los puestos.", 3000, "error");
        }
    });

    if (accion === "Editar" && usuario) {
        $('#usuarioId').val(usuario.Id);
        $('#nombreUsuario').val(usuario.Nombre);
        $('#apellidoPUsuario').val(usuario.ApellidoPaterno);
        $('#apellidoMUsuario').val(usuario.ApellidoMaterno);
        $('#rpeUsuario').val(usuario.RPE);
        $('#activoUsuario').val(usuario.Activo);
    }
    else if (accion === "Nuevo") {
        $('#usuarioId').val("");
        $('#nombreUsuario').val("");
        $('#apellidoPUsuario').val("");
        $('#apellidoMUsuario').val("");
        $('#rpeUsuario').val("");
        $('#activoUsuario').val("1");
    }

    $('#modalUsuario').fadeIn(200);
}

function GenerarVistaPreviaRegistros() {

    const desayunoCheck = $('#checkDesayuno').is(':checked');
    const comidaCheck = $('#checkComida').is(':checked');
    const cenaCheck = $('#checkCena').is(':checked');

    const descripcion = $('#descripcionActividades').val().trim();
    const Justificante = $('#justifiacionActividades').val().trim();
    const fecha = $('#fechaRealizada').val();
    const horaInicio = $('#horaInicio').val();
    const horaFin = $('#horaFin').val();

    if (!fecha || !horaInicio || !horaFin || descripcion === "" || Justificante === "") {
        AlertaCustom("Por favor, llena todos los campos obligatorios.", 3000, "error");
        return;
    }

    if (!desayunoCheck && !comidaCheck && !cenaCheck) {
        AlertaCustom("Debes seleccionar al menos un concepto de comida.", 3000, "error");
        return;
    }

    const desayunoMonto = desayunoCheck ? 154 : 0;
    const comidaMonto = comidaCheck ? 301 : 0;
    const cenaMonto = cenaCheck ? 154 : 0;

    const nuevoRegistro = {
        fecha,
        horario: `${horaInicio} - ${horaFin}`,
        desayuno: `$${desayunoMonto.toFixed(2)}`,
        comida: `$${comidaMonto.toFixed(2)}`,
        cena: `$${cenaMonto.toFixed(2)}`,
        desayunoCheck,
        comidaCheck,
        cenaCheck,
        actividades: descripcion,
        justificante: Justificante
    };

    alimentos.push(nuevoRegistro);

    $('input[type="checkbox"]').not('#chkPrimaDominical, #chkFestivoTrabajado, #chkOtroConcepto').prop('checked', false);
    $('#descripcionActividades').val('');
    $('#justifiacionActividades').val('');
    $('#fechaRealizada').val('');
    $('#horaInicio').val('');
    $('#horaFin').val('');

    AlertaCustom("Registro agregado correctamente.", 2000, "success");

}

function abrirModalVistaPrevia() {
    if (alimentos.length === 0) {
        $("#tablaModalConceptos").hide();
        $("#mensajeSinDatos").show();
        return;
    }

    $("#tablaModalBody").empty();

    alimentos.forEach((item, index) => {
        const fila = `
            <tr data-index="${index}">
                <td>${item.fecha}</td>
                <td>${item.horario}</td>
                <td>${item.desayunoCheck ? "✔" : "X"}</td>
                <td>${item.comidaCheck ? "✔" : "X"}</td>
                <td>${item.cenaCheck ? "✔" : "X"}</td>
                <td>${item.actividades}</td>
                <td><button class="btn-eliminar"><img src="Images/borrar.png" alt="Eliminar"></button></td>
            </tr>
        `;
        $("#tablaModalBody").append(fila);
    });

    $("#mensajeSinDatos").hide();
    $("#tablaModalConceptos").show();
    $("#modalVistaPrevia").show();
}

function GenerarRegistroHorasExtra() {

    const fecha = $('#fechaRegistro').val();
    const horaInicio = $('#horaInicioHE').val();
    const horaFin = $('#horaFinHE').val();
    const cuentaContable = $('#cuentaContable').val();
    const desayuno = $('#chkDesayunoHE').is(':checked');
    const comida = $('#chkComidaHE').is(':checked');
    const cena = $('#chkCenaHE').is(':checked');

    if (!fecha || !horaInicio || !horaFin) {
        AlertaCustom("Completa todos los campos de horas extra.", 3000, "error");
        return;
    }

    const nuevo = {
        fecha,
        horaInicio,
        horaFin,
        desayuno,
        comida,
        cena,
        cuentaContable
    };

    alimentos.push(nuevo);

    $('#fechaRegistro').val('');
    $('#horaInicioHE').val('');
    $('#horaFinHE').val('');
    $('#cuentaContable').val('');

    $('#chkDesayunoHE').prop('checked', false);
    $('#chkComidaHE').prop('checked', false);
    $('#chkCenaHE').prop('checked', false);

    AlertaCustom("Registro agregado correctamente.", 2000, "success");
}

function abrirModalVistaPreviaHorasExtra() {

    $("#tablaModalBody").empty();

    alimentos.forEach((item, index) => {
        const fila = `
            <tr data-index="${index}">
                <td>${item.fecha}</td>
                <td>${item.horaInicio} - ${item.horaFin}</td>
                <td>${item.desayuno ? "✔" : "X"}</td>
                <td>${item.comida ? "✔" : "X"}</td>
                <td>${item.cena ? "✔" : "X"}</td>
                <td>--</td>
                <td><button class="btn-eliminar"><img src="Images/borrar.png"></button></td>
            </tr>
        `;
        $("#tablaModalBody").append(fila);
    });

    $("#mensajeSinDatos").hide();
    $("#tablaModalConceptos").show();
    $("#modalVistaPrevia").show();
}

function GenerarReporteHorasExtra() {

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


    const horasExtraData = {
        empleado: {
            nombre: `${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`,
            rpe: datosUsuario.RPE,
            puesto: datosUsuario.Puesto
        },
        horasExtra: alimentos  
    };

    sessionStorage.setItem('reporteHorasExtra', JSON.stringify(horasExtraData));

    window.open('../Templates/HorasExtra.html', '_blank');
}
