'use strict'
const url = 'https://62c22e122af60be89ed345e8.mockapi.io/api/tpeweb/arreglo';

let urlInicio = "inicio.html";
let urlContacto = "contacto.html";
let urlProductos = "productos.html";
let urlRaptor = "raptor.html";

let inicio = document.querySelector("#jsinicio");
let all = document.querySelector("#content");

let contacto = document.querySelector("#jscontacto");
contacto.addEventListener("click", cargarContacto);

let productos = document.querySelector("#jsproductos");
productos.addEventListener("click", cargarProductos);


cargarInicio();

inicio.addEventListener("click", cargarInicio);

async function cargarInicio() {
  all.innerHTML = "<h1>Loading</h1>";
  try {
    let promesa = await fetch(urlInicio);
    if (promesa.ok) {
      let respuesta = await promesa.text();
      if (respuesta) {
        all.innerHTML = respuesta;
      }
    }
  } catch (error) {
    all.innerHTML = "<h1>Error - Conection Failed!</h1>";
  }
}


async function cargarProductos() {
  all.innerHTML = "<h1>Loading</h1>";
  try {
    let promesa = await fetch(urlProductos);
    if (promesa.ok) {
      let respuesta = await promesa.text();
      if (respuesta) {
        all.innerHTML = respuesta;

        let raptor = document.querySelector("#jsraptor");
        raptor.addEventListener("click", cargarRaptor);

        async function cargarRaptor() {
          all.innerHTML = "<h1>Loading</h1>";
          try {
            let promesa = await fetch(urlRaptor);
            if (promesa.ok) {
              let respuesta = await promesa.text();
              if (respuesta) {
                all.innerHTML = respuesta;
              }
            }
          } catch (error) {
            all.innerHTML = "<h1>Error - Conection Failed!</h1>";
          }
        }
      }
    }
  } catch (error) {
    all.innerHTML = "<h1>Error - Conection Failed!</h1>";
  }
}

async function cargarContacto() {
  all.innerHTML = "<h1>Loading</h1>";
  try {
    let promesa = await fetch(urlContacto);
    if (promesa.ok) {
      let respuesta = await promesa.text();
      if (respuesta) {
        all.innerHTML = respuesta;

        cargarJS();

        function cargarJS() {
          
          let captcha = document.querySelector('#captcha');
          let input = document.querySelector('#inputCaptcha');
          let botonValidar = document.querySelector('#validarCaptcha');
          let botonRegenerar = document.querySelector('#regenerarCaptcha');
          const arrLetras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
          let aux;
          let validacion = document.querySelector('#validacion');
          let submitForm = document.querySelector('#submitForm');
          let submitComment = document.querySelector('#submitComment');


          submitForm.addEventListener('click', preventDefault);
          botonValidar.addEventListener('click', funcionValidar);
          botonRegenerar.addEventListener('click', funcionRegenerar);



          generar();


          function generar(e) {
            for (let i = 0; i < 5; i++) {
              aux = arrLetras[Math.floor((Math.random() * ((arrLetras.length) - 1)) + 1)];
              captcha.innerHTML = aux + captcha.innerHTML;
            }
          }

          function preventDefault(e) {
            e.preventDefault();
            if (funcionValidar(e)) {
              submitComment.innerHTML = "Form sent correctly.";
            }
            else {
              validacion.innerHTML = "Captcha error. Try again.";
            }
          }

          function funcionValidar(e) {
            e.preventDefault();
            if (input.value === captcha.innerHTML) {
              validacion.innerHTML = "Validado. Puedes enviar el formulario.";
              return true;
            }
            else {
              validacion.innerHTML = "Error al validar, por favor, intentelo nuevamente.";
              return false;
            }
          }

          function funcionRegenerar() {
            captcha.innerHTML = "";
            validacion.innerHTML = "";
            input.value = "";

            generar();
          }

          obtenerComentarios();

          document.querySelector('#btnAgregar').addEventListener('click', enviarComentario);

          async function enviarComentario() {
            let nombre = document.querySelector('#usuario').value;
            let comentario = document.querySelector('#comentario').value;
            let puntuacion = document.querySelector('#puntuacion').value;

            let publicacion = {
              "nombre": nombre,
              "comentario": comentario,
              "puntuacion": puntuacion,
            }

            try {
              let res = await fetch(url, {
                "method": "POST",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(publicacion)
              });

              if (res.status === 201) {
                console.log('Enviado');
              }
            }
            catch (error) {
              console.log(error);
            }
            obtenerComentarios();
          }

          document.querySelector('#btnBorrarTodo').addEventListener('click', borrarComentarios);

          async function borrarComentarios() {
            try {
              let res = await fetch(url);
              let json = await res.json();

              for (const publicacion of json) {
                let res = await fetch(`${url}/${publicacion.publicacion}`, {
                  "method": "DELETE"
                });

                if (res.status === 200) {
                  console.log('Eliminado');
                }
              }
            }
            catch (error) {
              console.log(error);
            }

            obtenerComentarios();
          }

          document.querySelector("#btnFiltrado").addEventListener("click", filtrado);

          async function filtrado() {
            let valor = document.querySelector("#casilleroFiltro").value;

            const tabla = document.querySelector('#tablaComentarios');
            tabla.innerHTML = "";

            try {
              let res = await fetch(url);
              let json = await res.json();
              tabla.innerHTML = "";
              tabla.innerHTML = "<tr>" + "<th>" + "User" + "</th>" + "<th>" + "COMENTARIO" + "</th>" + "<th>" + "Rating" + "</th>" + "<th>" + "Options" + "</th>" + "</tr>";
              for (const renglon of json) {
                let nombre = renglon.nombre;
                let comentario = renglon.comentario;
                let puntuacionNumber = renglon.puntuacion;
                let id = renglon.publicacion;
                let puntuacion = puntuacionNumber.toString();

                if ((nombre.includes(valor)) || (comentario.includes(valor)) || (puntuacion.includes(valor)) || (id.includes(valor))) {
                  tabla.innerHTML += "<tr>" + "<td>" + nombre + "</td>" + "<td>" + comentario + "</td>" + "<td>" + puntuacion + "</td>" + "<td>" + "<button class='btnOpcionales' onclick='borrarComentario(this)' value='" + id + "'> " + "Eliminar" + "</button>" + "<button class='btnOpcionales' onclick='modificarComentario(this)' value='" + id + "'> " + "Modificar" + "</button>" + "</td>" + "</tr>";
                }
              }
            }

            catch (error) {
              console.log(error);
            }
          }

          document.querySelector("#btnAgregarVarios").addEventListener("click", agregarVarios);

          async function agregarVarios() {
            let nombre = document.querySelector('#usuario').value;
            let comentario = document.querySelector('#comentario').value;
            let puntuacion = document.querySelector('#puntuacion').value;

            let publicacion = {
              "nombre": nombre,
              "comentario": comentario,
              "puntuacion": puntuacion,
            }
            try {
              let cantidadComents = document.querySelector("#agregarVariosNumero").value;
              cantidadComents = Number(cantidadComents);
                for (let i = 0; i < cantidadComents; i++) {
                        let res = await fetch(url, {
                            "method": "POST",
                            "headers": { "Content-type": "application/json" },
                            "body": JSON.stringify(publicacion)
                        });
                        if (res.status === 201) {
                          console.log('Enviado');
                        }
                }
            }
            catch (error) {
                console.log(error);
            }
            obtenerComentarios();
          }
        }
      }
    }

  } catch (error) {
    all.innerHTML = "<h1>Error - Conection Failed!</h1>";
  }
}



async function modificarComentario(boton) {
  let renglon = boton.value;

  let nombre = document.querySelector('#usuario').value;
  let comentario = document.querySelector('#comentario').value;
  let puntuacion = document.querySelector('#puntuacion').value;

  let publicacion = {
    "nombre": nombre,
    "comentario": comentario,
    "puntuacion": puntuacion,
  }

  try {
    let res = fetch(`${url}/${renglon}`, {
      "method": "PUT",
      "headers": { "Content-type": "application/json" },
      "body": JSON.stringify(publicacion)
    });

    if (res.status === 200) {
      console.log('Editado');
    }
  }
  catch (error) {
    console.log(error);
  }
  obtenerComentarios();
  obtenerComentarios();
}

async function borrarComentario(boton) {
  let renglon = boton.value;
  try {
      let res = await fetch(`${url}/${renglon}`, {
        "method": "DELETE"
      });

      if (res.status === 200) {
        console.log('Eliminado');
      }
  }
  catch (error) {
    console.log(error);
  }

  obtenerComentarios();
}

async function obtenerComentarios() {
  document.getElementById("usuario").value = "";
  document.getElementById("comentario").value = "";
  document.getElementById("puntuacion").value = "";
  document.getElementById("agregarVariosNumero").value = "";

  const tabla = document.querySelector('#tablaComentarios');
  tabla.innerHTML = "";

  try {
    
    let res = await fetch(url);
    let json = await res.json();
    tabla.innerHTML = "<tr>" + "<th>" + "User" + "</th>" + "<th>" + "Comment" + "</th>" + "<th>" + "Rate" + "</th>" + "<th>" + "Options" + "</th>" + "</tr>"; + "";

    for (const renglon of json) {
      let nombre = renglon.nombre;
      let comentario = renglon.comentario;
      let puntuacionNumber = renglon.puntuacion;
      let id = renglon.publicacion;
      let puntuacion = puntuacionNumber.toString();
      tabla.innerHTML += "<tr>" + "<td>" + nombre + "</td>" + "<td>" + comentario + "</td>" + "<td>" + puntuacion + "</td>" + "<td>" + "<button class='btnOpcionales' onclick='borrarComentario(this)' value='" + id + "'> " + "Eliminar" + "</button>" + "<button class='btnOpcionales' onclick='modificarComentario(this)' value='" + id + "'> " + "Modificar" + "</button>" + "</td>" + "</tr>";
    }
  }

  catch (error) {
    console.log(error);
  }


}

/* MENU */
const toggleButton = document.querySelector("#menuDesplegable");
const navWrapper = document.querySelector("#nav");

toggleButton.addEventListener("click", () => {
  toggleButton.classList.toggle("close");
  navWrapper.classList.toggle("show");
});


navWrapper.addEventListener("click", e => {
  if (e.target.id === "nav") {
    navWrapper.classList.remove("show");
    toggleButton.classList.remove("close");
  }
});