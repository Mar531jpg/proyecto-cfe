$(document).ready(function () {

  $('#formTiempoExtra').on('submit', function (e) {
    e.preventDefault();

    const datos = {
      trabajador: $('#trabajador').val().trim(),
      horas: parseInt($('#horas').val() || "0"),
      fecha: $('#fecha').val()
    };

    fetch("../backend/generar_pdf.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "FormatoCFE.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert("No se pudo generar el PDF"));

  });

  $('#btnRegresar').on('click', function () {
    window.location.href = "index.html";
  });

});
