$(document).ready(function () {

    const data = JSON.parse(sessionStorage.getItem("reporteHorasExtra"));


    if (!data) return;

    const empleado = data.empleado;
    const registros = data.horasExtra || [];

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

    function segundosEntre(hInicio, hFin) {
        const parts1 = hInicio.split(":").map(Number);
        const parts2 = hFin.split(":").map(Number);
        if (parts1.length < 2 || parts2.length < 2) return 0;
        const inicio = parts1[0] * 3600 + parts1[1] * 60 + (parts1[2] || 0);
        const fin = parts2[0] * 3600 + parts2[1] * 60 + (parts2[2] || 0);
        return fin >= inicio ? (fin - inicio) : (fin + 24 * 3600 - inicio);
    }

    function formatoHHMMSS(segundos) {
        const h = Math.floor(segundos / 3600);
        const m = Math.floor((segundos % 3600) / 60);
        const s = segundos % 60;
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        const ss = String(s).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }

   
    registros.forEach(reg => {

        const inicio = reg.inicio || reg.horaInicio || "";
        const fin = reg.fin || reg.horaFin || "";

        const segs = (inicio && fin) ? segundosEntre(inicio, fin) : 0;
        const totalHorasFila = formatoHHMMSS(Math.round(segs));

        if (reg.desayuno) totalDesayunos++;
        if (reg.comida) totalComidas++;
        if (reg.cena) totalCenas++;

        $("#tablaHorasExtraBody").append(`
            <tr>
                <td>${reg.fecha}</td>
                <td style="text-align:center;">${inicio}</td>
                <td style="text-align:center;">${fin}</td>
                <td style="text-align:center;">${totalHorasFila}</td>

                <td style="text-align:center;">${reg.desayuno ? "X" : ""}</td>
                <td style="text-align:center;">${reg.comida ? "X" : ""}</td>
                <td style="text-align:center;">${reg.cena ? "X" : ""}</td>

                <td style="text-align:center;">${reg.cuentaContable || ""}</td>
            </tr>
        `);
    });

    let totalSegundosSemana = 0;

    registros.forEach(reg => {
        const inicio = reg.inicio || reg.horaInicio;
        const fin = reg.fin || reg.horaFin;
        if (!inicio || !fin) return;
        totalSegundosSemana += segundosEntre(inicio, fin);
    });

    const totalSemanaHHMMSS = formatoHHMMSS(totalSegundosSemana);

    $("#horasSemana").text(totalSemanaHHMMSS);



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
