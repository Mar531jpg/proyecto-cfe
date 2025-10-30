function AlertaCustom(mensaje, tiempo = 3000, tipo = "error") {
  const contenedor = document.getElementById("alert-container");

  const alerta = document.createElement("div");
  alerta.classList.add("alerta", tipo);

  const imagenSrc = tipo === "error"  ? "Images/error.png" : "Images/success.png";

  alerta.innerHTML = `
    <img src="${imagenSrc}" alt="${tipo}">
    <span>${mensaje}</span>
  `;

  contenedor.appendChild(alerta);

  setTimeout(() => alerta.classList.add("mostrar"), 100);

  setTimeout(() => {
    alerta.classList.remove("mostrar");
    setTimeout(() => alerta.remove(), 400);
  }, tiempo);
}
