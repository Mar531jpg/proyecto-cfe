$(document).ready(function () {
    const reporteData = JSON.parse(sessionStorage.getItem('reporteAlimentos'));
    if (!reporteData) return;

    const empleado = reporteData.empleado;
    const alimentos = reporteData.alimentos;
    const globales = reporteData.globales || { primaDominical: false, festivoTrabajado: false, otroConcepto: false };

    const encargadoAutorizar = {
        nombre: "ING. JORGE ALFREDO LASTRA ARIAS",
        puesto: "SUPERINTENDENTE ZONA TRANSMISIÓN ISTMO"
    };

    $(".nombreEmpleado").text(empleado.nombre);
    $("#rpeEmpleado").text(empleado.rpe);
    $(".puestoEmpleado").text(empleado.puesto);
    $(".EncargadoAutorizar").text(encargadoAutorizar.nombre);
    $(".puestoEncargadoAutorizar").text(encargadoAutorizar.puesto);

    const hoy = new Date();
    const opcionesFecha = { day: "2-digit", month: "long", year: "numeric" };
    $("#fechaActual").text(hoy.toLocaleDateString("es-MX", opcionesFecha).toUpperCase());

    let total = 0;
    alimentos.forEach(item => {
        const getMonto = val => parseFloat(val.replace("$", "")) || 0;
        const totalDia = getMonto(item.desayuno) + getMonto(item.comida) + getMonto(item.cena);
        total += totalDia;

        $("#tablaConceptosBody").append(`
            <tr>
                <td>${item.fecha}</td>
                <td>${item.horario}</td>
                <td>${item.desayuno}</td>
                <td>${item.comida}</td>
                <td>${item.cena}</td>
                <td>${item.actividades}</td>
            </tr>
        `);
    });

    // Mostrar los checks globales en VoBo
    $("#firmaVoBo").html(`
        <div style="display:flex; flex-direction:column; gap:4px; text-align:left; margin-top:5px;">
            <span>Prima dominical: ${globales.primaDominical ? "✔" : "X"}</span>
            <span>Día festivo trabajado: ${globales.festivoTrabajado ? "✔" : "X"}</span>
            <span>Otro concepto: ${globales.otroConcepto ? "✔" : "X"}</span>
        </div>
    `);

    $("#totalGeneral").text(total.toFixed(2));
    $("#totalLetras").text(numeroALetras(total));

    $("#btnDescargarPDF").click(function () {

        const { jsPDF } = window.jspdf;

        const elemento = document.querySelector(".pdf-page");

        html2canvas(elemento, { scale: 3 }).then(canvas => {

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "letter"
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth;
            const imgHeight = canvas.height * (imgWidth / canvas.width);

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Reporte_Alimentos_${empleado.nombre}.pdf`);
        });

    });
});


function numeroALetras(num) {
    const unidades = ['','UN','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE'];
    const especiales = ['DIEZ','ONCE','DOCE','TRECE','CATORCE','QUINCE','DIECISÉIS','DIECISIETE','DIECIOCHO','DIECINUEVE'];
    const decenas = ['','','VEINTE','TREINTA','CUARENTA','CINCUENTA','SESENTA','SETENTA','OCHENTA','NOVENTA'];
    const centenas = ['','CIENTO','DOSCIENTOS','TRESCIENTOS','CUATROCIENTOS','QUINIENTOS','SEISCIENTOS','SETECIENTOS','OCHOCIENTOS','NOVECIENTOS'];

    function seccion(num) {
        let texto = '';
        if(num === 100) return 'CIEN';
        let c = Math.floor(num/100);
        let d = Math.floor((num%100)/10);
        let u = num%10;
        if(c>0) texto += centenas[c] + ' ';
        if(d===1 && u>0) texto += especiales[u] + ' ';
        else {
            if(d>0) texto += decenas[d] + (u>0?' Y ':' ');
            if(u>0) texto += unidades[u] + ' ';
        }
        return texto.trim();
    }

    let entero = Math.floor(num);
    let centavos = Math.round((num - entero) * 100);
    let miles = Math.floor(entero / 1000);
    let resto = entero % 1000;

    let letras = '';
    if(miles>0){
        if(miles===1) letras += 'MIL ';
        else letras += seccion(miles) + ' MIL ';
    }
    letras += seccion(resto);
    return letras.trim() + ` PESOS ${centavos.toString().padStart(2,'0')}/100 M.N.`;
}