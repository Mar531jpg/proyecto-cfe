$(document).ready(function () {

    const data = {
        actividad: "INVESTIGACIÓN, ELABORACIÓN Y CARGA DE REQUISITOS LEGALES EN EL SISST",
        elabora: {
            nombre: "MISAEL CUEVAS ZACARÍAS",
            puesto: "AUXILIAR ADMINISTRATIVO"
        },

        registros: [
            {
                zona: "ISTMO",
                trabajador: "JUAN PÉREZ LÓPEZ",
                salario: 520.35,
                hrsDobles: 2,
                factorDobles: 104.07,
                hrsTriples: 1,
                factorTriples: 156.10,
                desayuno: true,
                comida: false,
                cena: true,
                viaticos: 300,
                diasViaticos: 1,
                observaciones: "Revisión de líneas."
            },

            {
                zona: "ISTMO",
                trabajador: "CARLOS RAMÍREZ CRUZ",
                salario: 480.10,
                hrsDobles: 1,
                factorDobles: 96.02,
                hrsTriples: 0,
                factorTriples: 0,
                desayuno: false,
                comida: true,
                cena: false,
                viaticos: 0,
                diasViaticos: 0,
                observaciones: "Apoyo en mantenimiento."
            },

            {
                zona: "ISTMO",
                trabajador: "ROBERTO MORALES SANTIAGO",
                salario: 610.20,
                hrsDobles: 3,
                factorDobles: 183.06,
                hrsTriples: 2,
                factorTriples: 244.08,
                desayuno: true,
                comida: true,
                cena: false,
                viaticos: 450,
                diasViaticos: 2,
                observaciones: "Supervisión de campo.Supervisión de campo."
            },

            {
                zona: "ISTMO",
                trabajador: "MANUEL GARCÍA RUIZ",
                salario: 550.00,
                hrsDobles: 0,
                factorDobles: 0,
                hrsTriples: 1,
                factorTriples: 183.33,
                desayuno: false,
                comida: false,
                cena: false,
                viaticos: 0,
                diasViaticos: 0,
                observaciones: "Guardia."
            }
        ]
    };

    if (!data) return;

    const registros = data.registros || [];
    const elabora = data.elabora || { nombre: "", puesto: "" };

    $("#elaboraNombre").text(elabora.nombre);
    $("#elaboraPuesto").text(elabora.puesto);

    $("#actividades-titulo").text(" " + (data.actividad || ""));


    let totalImporte = 0;
    let totalAlimentos = 0;

    registros.forEach(reg => {

        const importe = (Number(reg.factorDobles) || 0) + (Number(reg.factorTriples) || 0);

        totalImporte += importe;

        const desayunoMonto = reg.desayuno ? 154 : 0;
        const comidaMonto = reg.comida ? 301 : 0;
        const cenaMonto = reg.cena ? 154 : 0;

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

                <td style="text-align:center;">${reg.desayuno ? "X" : ""}</td>
                <td style="text-align:center;">${reg.comida ? "X" : ""}</td>
                <td style="text-align:center;">${reg.cena ? "X" : ""}</td>

                <td style="text-align:center;">$${totalAlimentosRegistro}</td>

                <td style="text-align:center;">$${reg.viaticos || "0"}</td>
                <td style="text-align:center;">${reg.diasViaticos || "0"}</td>

                <td>${reg.observaciones || ""}</td>
            </tr>
        `);
    });

    $("#totalImporte").text("$" + totalImporte.toFixed(2));
    $("#totalAlimentos").text("$" + totalAlimentos.toFixed(2));


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
