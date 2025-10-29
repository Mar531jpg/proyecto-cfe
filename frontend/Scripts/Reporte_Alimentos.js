
$(document).ready(function () {

  const empleado = {
    nombre: "MISAEL CUEVAS ZACARÍAS",
    rpe: "91234",
    puesto: "PATRÓN",
    jefe: "ING. JORGE ALFREDO LASTRA ARIAS"
  };

  const encargadoAutorizar = {
    nombre: "ING. JORGE ALFREDO LASTRA ARIAS",
    puesto: "SUPERINTENDENTE ZONA TRANSMISIÓN ISTMO"
  };

  const alimentos = [
    {
      fecha: "2025-10-25",
      horario: "07:00 - 15:00",
      desayuno: "$80.00",
      comida: "$120.00",
      cena: "$0.00",
      actividades: "Hola"
    },
    {
      fecha: "2025-10-26",
      horario: "15:00 - 23:00",
      desayuno: "$0.00",
      comida: "$120.00",
      cena: "$100.00",
      actividades: "Supervisión de pruebas eléctricas"
    },
    {
      fecha: "2025-10-27",
      horario: "08:00 - 17:00",
      desayuno: "$80.00",
      comida: "$120.00",
      cena: "$0.00",
      actividades: "Apoyo en maniobras de subestación"
    }
  ];

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

    $("#totalGeneral").text(total.toFixed(2));

    $("#totalLetras").text(numeroALetras(total));

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