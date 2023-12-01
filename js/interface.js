//Tomamos el boton
let botonVolver = document.getElementById("btn-volver");
// Cuando el usuario desciende y se pasan 20px desde el tope del documento, se muestra el boton
function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    botonVolver.style.display = "block";
  } else {
    botonVolver.style.display = "none";
  }
}
// Al pulsar en el botón llamamos a la función volverArriba
botonVolver.addEventListener("click", volverArriba);

//Esta función vuelve a subir el Scroll a la parte del tope de arriba
function volverArriba() {
 window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
}