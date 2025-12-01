$(document).ready(function () {

    //const data = JSON.parse(sessionStorage.getItem("reporteHorasExtra"));

    const data = {
        empleado: {
            rpe: "123456",
            nombre: "JUAN PÉREZ LÓPEZ",
            puesto: "TÉCNICO LÍNEAS DE TRANSMISIÓN",
            cuentaContable: "5210-003"
        },
        registros: [
            {
                fecha: "2025-11-29",
                inicio: "18:00",
                fin: "22:00",
                desayuno: false,
                comida: true,
                cena: true
            },
            {
                fecha: "2025-11-30",
                inicio: "07:00",
                fin: "10:30",
                desayuno: true,
                comida: true,
                cena: false
            }
        ]
    };


    if (!data) return;

    const empleado = data.empleado;
    const registros = data.registros || [];

    $("#rpeEmpleado").text(empleado.rpe);
    $(".nombreEmpleado").text(empleado.nombre);
    $(".puestoEmpleado").text(empleado.puesto);

    $("#trabajadorNombre").text(empleado.nombre);
    $("#trabajadorCategoria").text(empleado.puesto);

    // FECHA ACTUAL
    const hoy = new Date();
    const opcionesFecha = { day: "2-digit", month: "long", year: "numeric" };
    $("#fechaActual").text(hoy.toLocaleDateString("es-MX", opcionesFecha).toUpperCase());

    let totalDesayunos = 0;
    let totalComidas = 0;
    let totalCenas = 0;

    registros.forEach(reg => {

        // SUMA ALIMENTOS
        if (reg.desayuno) totalDesayunos++;
        if (reg.comida) totalComidas++;
        if (reg.cena) totalCenas++;

        // INSERTAR EN TABLA
        $("#tablaHorasExtraBody").append(`
            <tr>
                <td>${reg.fecha}</td>
                <td>${reg.inicio}</td>
                <td>${reg.fin}</td>

                <td>${reg.desayuno ? "X" : ""}</td>
                <td>${reg.comida ? "X" : ""}</td>
                <td>${reg.cena ? "X" : ""}</td>

                <td>${empleado.cuentaContable || ""}</td>
            </tr>
        `);
    });


    $("#totalDesayunos").text(totalDesayunos);
    $("#totalComidas").text(totalComidas);
    $("#totalCenas").text(totalCenas);



    $("#btnDescargarPDF").click(function () {

        const { jsPDF } = window.jspdf;

        const elemento = document.querySelector(".pdf-page");

        html2canvas(elemento, { scale: 3 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth;
            const imgHeight = canvas.height * (imgWidth / canvas.width);

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`HorasExtra_${empleado.nombre}.pdf`);
        });

    });

});
