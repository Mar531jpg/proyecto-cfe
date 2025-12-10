$(document).ready(function () {

    const registros = JSON.parse(sessionStorage.getItem("registrosDia")) || [];
    if (!registros || registros.length === 0) {
        alert("No hay registros para generar el reporte del día.");
        return;
    }

    const datosUsuario = JSON.parse(sessionStorage.getItem('usuario')) || { nombre: "", puesto: "" };

    $("#elaboraNombre").text(datosUsuario.Nombre || "");
    $("#elaboraPuesto").text(datosUsuario.Puesto || "");
    //$("#actividades-titulo").text("Resumen del Día"); 

    let totalImporte = 0;
    let totalAlimentos = 0;

    registros.forEach(reg => {

    const importe = (Number(reg.factorDobles) || 0) + (Number(reg.factorTriples) || 0);
    totalImporte += importe;

    const desayunoMonto = (Number(reg.desayuno) || 0) * 154;
    const comidaMonto   = (Number(reg.comida)   || 0) * 301;
    const cenaMonto     = (Number(reg.cena)     || 0) * 154;

    const totalAlimentosRegistro = desayunoMonto + comidaMonto + cenaMonto;
    totalAlimentos += totalAlimentosRegistro;

    $("#tablaResumenBody").append(`
        <tr>
            <td>${reg.zona || ""}</td>
            <td>${reg.trabajador || ""}</td>

            <td style="text-align:center;">$${reg.salario || "0"}</td>

            <td style="text-align:center;">${reg.hrsDobles || "0"}</td>
            <td style="text-align:center;">$${reg.factorDobles || "0"}</td>

            <td style="text-align:center;">${reg.hrsTriples || "0"}</td>
            <td style="text-align:center;">$${reg.factorTriples || "0"}</td>

            <td style="text-align:center;">$${importe.toFixed(2)}</td>

            <td style="text-align:center;">${Number(reg.desayuno) || 0}</td>
            <td style="text-align:center;">${Number(reg.comida)   || 0}</td>
            <td style="text-align:center;">${Number(reg.cena)     || 0}</td>

            <td style="text-align:center;">$${totalAlimentosRegistro.toFixed(2)}</td>

            <td style="text-align:center;">$${reg.viaticos || "0"}</td>
            <td style="text-align:center;">${reg.diasViaticos || "0"}</td>

            <td>${reg.observaciones || ""}</td>
        </tr>
    `);
});


    $("#totalImporte").text("$" + totalImporte.toFixed(2));
    $("#totalAlimentos").text("$" + totalAlimentos.toFixed(2));

    $("#btnGenerarReporteDia").click(function () {

        const reporteData = {
            elabora: {
                nombre: datosUsuario.Nombre || "",
                puesto: datosUsuario.Puesto || ""
            },
            actividad: "Resumen del Día",
            registros: registros
        };

        sessionStorage.setItem("resumenDia", JSON.stringify(reporteData));

        window.open("ResumenDia.html", "_blank");
    });

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
            pdf.save(`ResumenDia.pdf`);
        });
    });

});
