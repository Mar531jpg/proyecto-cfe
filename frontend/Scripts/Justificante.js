$(document).ready(function () {

    const actividades = JSON.parse(sessionStorage.getItem("justificanteData")) || [];

    actividades.forEach((item, index) => {

        const justificanteData = {
            actividadTitulo: item.actividadTitulo,
            texto: item.justificante,
            elabora: item.solicita,
            solicita: {
                nombre: "ING JORGE ALFREDO LASTRA ARIAS",
                puesto: "SUPERINTENDENTE DE ZONA ISTMO"
            }
        };

        $("#tituloActividad").text(justificanteData.actividadTitulo);
        $("#textoJustificacion").text(justificanteData.texto);
        $("#nombreElabora").text(justificanteData.elabora.nombre);
        $("#puestoElabora").text(justificanteData.elabora.puesto);
        $("#nombreSolicita").text(justificanteData.solicita.nombre);
        $("#puestoSolicita").text(justificanteData.solicita.puesto);

        const { jsPDF } = window.jspdf;
        const elemento = document.querySelector(".pdf-page");

        html2canvas(elemento, { scale: 3 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth;
            const imgHeight = canvas.height * (imgWidth / canvas.width);
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Justificante_${index + 1}_${justificanteData.elabora.nombre}.pdf`);
        });
    });

});
