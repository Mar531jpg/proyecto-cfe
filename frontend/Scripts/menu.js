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
        $("#tabRegistrosHoy").hide();
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
        } else if (id === 'registrosHoy') {
            $('.container').hide();
            CargarRegistrosHoy();
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

    $("#btnCerrarModalRegistros").on("click", function () {
        $("#modalRegistrosDia").hide();
    });

    $('#btnFiltrarRegistros').on('click', function() {
        const fechaInicio = $('#fechaInicio').val();
        const fechaFin = $('#fechaFin').val();

        if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
            AlertaCustom("Debes ingresar ambas fechas para filtrar.", 3000, "error");
            return;
        }

        CargarRegistrosHoy(fechaInicio, fechaFin);
    });



    $('#btnVerRegistrosDia').on('click', function () {
        abrirModalRegistrosDia();
    });

    
    $('#btnGenerarReporteDia').on('click', function () {
        GenerarReporteDia();
    });

    $(document).on('click', '#tablaModalBody .btn-eliminar', function () {
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

    $("#btnCerrarModalVistaPrevia").click(function () {
        $("#modalVistaPrevia").hide();
    });


    $("#btnAgregarRegistroDia").on("click", function () {

        const nombre = $("#nombreEmpleado").val().trim();
        const puesto = $("#puestoEmpleado").val().trim();
        const rpe = $("#rpeEmpleado").val().trim();

        const totalDesayunos = parseInt($("#totalDesayunos").val()) || 0;
        const totalComidas = parseInt($("#totalComidas").val()) || 0;
        const totalCenas = parseInt($("#totalCenas").val()) || 0;

        const observaciones = $("#observaciones").val().trim();

        const salario = parseFloat($("#salario").val()) || 0;
        const horasDobles = parseFloat($("#horasDobles").val()) || 0;
        const factorDobles = parseFloat($("#factorDobles").val()) || 0;
        const horasTriples = parseFloat($("#horasTriples").val()) || 0;
        const factorTriples = parseFloat($("#factorTriples").val()) || 0;
        const viaticos = parseFloat($("#viaticos").val()) || 0;
        const diasViaticos = parseFloat($("#diasViaticos").val()) || 0;


        if (nombre === "" || puesto === "" || rpe === "") {
            AlertaCustom("Selecciona un empleado de la tabla antes de agregar.", 3000, "error");
            return;
        }

        if (isNaN(totalDesayunos) || isNaN(totalComidas) || isNaN(totalCenas)) {
            AlertaCustom("Los totales de comida no pueden estar vacíos.", 3000, "error");
            return;
        }

        if (observaciones === "") {
            AlertaCustom("Debes ingresar observaciones.", 3000, "error");
            return;
        }

        if (salario <= 0) {
            AlertaCustom("Debes ingresar un salario válido.", 3000, "error");
            return;
        }

        let registrosDia = JSON.parse(sessionStorage.getItem("registrosDia")) || [];

        const nuevoRegistro = {
            rpe: rpe,
            trabajador: nombre,
            puesto: puesto,
            salario: salario,
            hrsDobles: horasDobles,
            factorDobles: factorDobles,
            hrsTriples: horasTriples,
            factorTriples: factorTriples,
            totalDesayunos: totalDesayunos,
            totalComidas: totalComidas,
            totalCenas: totalCenas,
            desayuno: totalDesayunos,
            comida: totalComidas,
            cena: totalCenas,
            viaticos: viaticos,
            diasViaticos: diasViaticos,
            observaciones: observaciones
        };


        registrosDia.push(nuevoRegistro);

        sessionStorage.setItem("registrosDia", JSON.stringify(registrosDia));


        $("#formRegistroHoy")[0].reset();

        $("#nombreEmpleado").val(nombre);
        $("#puestoEmpleado").val(puesto);
        $("#rpeEmpleado").val(rpe);
        $("#totalDesayunos").val(totalDesayunos);
        $("#totalComidas").val(totalComidas);
        $("#totalCenas").val(totalCenas);

        AlertaCustom("Registro agregado correctamente.", 2000, "success");
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

    $("#tablaModalBody tr").each(function (i) {
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

    let totalDesayuno = 0;
    let totalComida = 0;
    let totalCena = 0;

    alimentos.forEach(reg => {
        if (reg.desayunoCheck && parseFloat(reg.desayuno.replace('$', '')) > 0) totalDesayuno++;
        if (reg.comidaCheck && parseFloat(reg.comida.replace('$', '')) > 0) totalComida++;
        if (reg.cenaCheck && parseFloat(reg.cena.replace('$', '')) > 0) totalCena++;
    });

    let formData = {
        Nombre: datosUsuario.Nombre,
        ApellidoPaterno: datosUsuario.ApellidoPaterno,
        ApellidoMaterno: datosUsuario.ApellidoMaterno,
        TotalDesayuno: totalDesayuno,
        TotalComida: totalComida,
        TotalCena: totalCena
    };

    $.ajax({
        url: '../backend/Guardar_Registro_Pdf.php',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function (response) {
            if (response.Result == 1) {
                AlertaCustom(response.Message, 3000, "success");
            } else {
                AlertaCustom(response.Message, 3000, "error");
            }
        },
        error: function () {
            AlertaCustom("Error al conectar con el servidor", 3000, "error");
        }
    });

    console.log("Datos que se enviarán al backend:", formData);

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

    let totalDesayuno = 0;
    let totalComida = 0;
    let totalCena = 0;

    alimentos.forEach((reg) => {

        if (reg.desayuno) {
            totalDesayuno++;
        }

        if (reg.comida) {
            totalComida++;
        }

        if (reg.cena) {
            totalCena++;
        }
    });

    let formData = {
        Nombre: datosUsuario.Nombre,
        ApellidoPaterno: datosUsuario.ApellidoPaterno,
        ApellidoMaterno: datosUsuario.ApellidoMaterno,
        TotalDesayuno: totalDesayuno,
        TotalComida: totalComida,
        TotalCena: totalCena
    };

    console.log("Datos que se enviarán al backend:", formData);



    $.ajax({
        url: '../backend/Guardar_Registro_Pdf.php',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function (response) {
            if (response.Result == 1) {
                AlertaCustom(response.Message, 3000, "success");
            } else {
                AlertaCustom(response.Message, 3000, "error");
            }
        },
        error: function () {
            AlertaCustom("Error al conectar con el servidor", 3000, "error");
        }
    });


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

function CargarRegistrosHoy(fechaInicio = "", fechaFin = "") {
    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            AlertaCustom("Fechas inválidas.", 3000, "error");
            return;
        }

        if (inicio > fin) {
            AlertaCustom("La fecha de inicio no puede ser mayor que la fecha fin.", 3000, "error");
            return;
        }
    }

    $.ajax({
        url: '../backend/Obtener_Registros_Hoy.php',
        type: 'GET',
        dataType: 'json',
        data: { 
            IdUsuario: 0,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        },
        success: function (response) {
            if (response.Result == 1) {
                const tbody = $('#tablaRegistrosHoyBody');
                tbody.empty();

                response.Registros.forEach(r => {
                    const fila = $(`
                        <tr data-nombre="${r.NombreCompleto}" 
                            data-puesto="${r.Puesto}" 
                            data-rpe="${r.RPE}"
                            data-totaldesayunos="${r.TotalDesayunos}" 
                            data-totalcomidas="${r.TotalComidas}" 
                            data-totalcenas="${r.TotalCena}">
                            <td>${r.NombreCompleto}</td>
                            <td>${r.TotalDesayunos}</td>
                            <td>${r.TotalComidas}</td>
                            <td>${r.TotalCena}</td>
                        </tr>
                    `);
                    tbody.append(fila);
                });

                $('#tablaRegistrosHoyBody tr').on('click', function () {
                    const fila = $(this);

                    $('#nombreEmpleado').val(fila.data('nombre'));
                    $('#puestoEmpleado').val(fila.data('puesto'));
                    $('#rpeEmpleado').val(fila.data('rpe'));

                    $('#totalDesayunos').val(fila.data('totaldesayunos'));
                    $('#totalComidas').val(fila.data('totalcomidas'));
                    $('#totalCenas').val(fila.data('totalcenas'));
                });

            } else {
                AlertaCustom(response.Message, 3000, "error");
            }
        },
        error: function () {
            AlertaCustom("Error al conectar con el servidor.", 3000, "error");
        }
    });
}


function abrirModalRegistrosDia() {
    let registros = JSON.parse(sessionStorage.getItem("registrosDia")) || [];

    if (registros.length === 0) {
        $("#tablaModalRegistros").hide();
        $("#mensajeSinRegistros").show();
        $("#modalRegistrosDia").show();
        return;
    }

    $("#tablaModalRegistrosBody").empty();

    registros.forEach((item, index) => {
        const fila = `
            <tr data-index="${index}">
                <td>${item.trabajador}</td>
                <td>${item.salario}</td>
                <td>${item.hrsDobles}</td>
                <td>${item.hrsTriples}</td>
                <td>${item.viaticos}</td>
                <td>${item.observaciones}</td>
                <td>
                    <button class="btn-eliminar-registro" data-index="${index}">
                        <img src="Images/borrar.png" alt="Eliminar" />
                    </button>
                </td>
            </tr>
        `;
        $("#tablaModalRegistrosBody").append(fila);
    });

    $("#mensajeSinRegistros").hide();
    $("#tablaModalRegistros").show();
    $("#modalRegistrosDia").show();
}

// Eliminar registro
$(document).on("click", ".btn-eliminar-registro", function () {
    const index = $(this).data("index");

    let registros = JSON.parse(sessionStorage.getItem("registrosDia")) || [];

    registros.splice(index, 1);

    sessionStorage.setItem("registrosDia", JSON.stringify(registros));


    registrosDia = registros;

    abrirModalRegistrosDia();

    AlertaCustom("Registro eliminado.", 2000, "success");
});

function GenerarReporteDia() {
    const registrosDia = JSON.parse(sessionStorage.getItem("registrosDia")) || [];

    if (registrosDia.length === 0) {
        AlertaCustom("No hay registros para generar el reporte del día.", 3000, "error");
        return;
    }

    let datosUsuario = JSON.parse(sessionStorage.getItem('usuario'));
    if (!datosUsuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "index.html";
        return;
    }

    let totalDesayuno = 0;
    let totalComida = 0;
    let totalCena = 0;

    registrosDia.forEach(reg => {
        if (reg.desayuno && parseFloat(reg.desayuno) > 0) totalDesayuno += parseFloat(reg.desayuno);
        if (reg.comida && parseFloat(reg.comida) > 0) totalComida += parseFloat(reg.comida);
        if (reg.cena && parseFloat(reg.cena) > 0) totalCena += parseFloat(reg.cena);
    });

    console.log("Totales:", { totalDesayuno, totalComida, totalCena });

    const reporteDia = {
        empleado: {
            nombre: `${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`,
            rpe: datosUsuario.RPE,
            puesto: datosUsuario.Puesto
        },
        registros: registrosDia
    };

    sessionStorage.setItem('resumenDia', JSON.stringify(reporteDia));

    window.open('../Templates/ResumenDia.html', '_blank');
}