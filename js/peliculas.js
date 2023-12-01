let myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjE0ZDc2NTUzZTI1NWYxYTY2YTQ2M2E5YWVlZjkzMCIsInN1YiI6IjY1M2Y3NThlY2M5NjgzMDBjOWU1MDEwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FqH5iyYw7QDd-7ZydOPSYQ2UH_hA4OcEeF6JUK-Iz3M");

let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};
let listaCategorias = new Array();

generarCategoriasJSON(); //Se ejecuta al principio para que aparezcan las categoría

let paginaActual = 1;
let paginasTotales = 1;
let categoriaActual = 0;

//Controlar el final de la página para carga progresiva...
window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        paginaActual++;
        if (paginaActual <= paginasTotales && categoriaActual > 0) { generarPeliculasJSON(categoriaActual, paginaActual) }
    }
    scrollFunction();
};





function generarCategoriasJSON() {
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=es", requestOptions)
        .then(response => response.json())
        .then(result => mostrarCategorias(result))
        .catch(error => console.log('error', error));
}

function generarPeliculasJSON(categoria, pagina) {
    fetch(`https://api.themoviedb.org/3/discover/movie?language=es&with_genres=${categoria}&page=${pagina}`, requestOptions)
        .then(response => response.json())
        .then(result => mostrarPeliculas(result))
        .catch(error => console.log('error', error));
}


function mostrarCategorias(resultados) {
    listaCategorias = [];
    paginaActual = 1;
    padre = document.getElementById("contenido");
    padre.innerHTML = "";
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-4", "justify-content-center");
    resultados.genres.forEach(elemento => {
        columna = document.createElement("div");
        columna.classList.add("col", "p-2");
        boton = document.createElement("button");
        boton.classList.add("btn", "btn-primary", "w-100");
        atributo = document.createAttribute("type");
        atributo.value = "button";
        boton.setAttributeNode(atributo);
        atributo = document.createAttribute("title");
        atributo.value = elemento.name;
        boton.setAttributeNode(atributo);
        boton.innerHTML = `${elemento.name}`;
        //añadir el click
        boton.addEventListener("click", function () {
            generarPeliculasJSON(elemento.id, paginaActual);
            categoriaActual = elemento.id;
        });
        fila.appendChild(columna).appendChild(boton);
        //crear elemento dropdownMenu
        crearItemMenu(elemento);
        listaCategorias.push(elemento);
    });

    padre.appendChild(fila);
}


//Motrar Peliculas
function mostrarPeliculas(resultados) {
    paginasTotales = resultados.total_pages;
    padre = document.getElementById("contenido");
    if (paginaActual == 1) {
        padre.innerHTML = "";
        fila = document.createElement("div");
        fila.classList.add("row", "row-cols-1", "justify-content-center");
        let cat = listaCategorias.find(obj => {
            return obj.id === categoriaActual
          });
        fila.innerHTML=`<h1 class="text-center">${cat.name}</h1>`;
        padre.appendChild(fila);
    }
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-4", "justify-content-center");
    resultados.results.forEach(elemento => {
        columna = document.createElement("div");
        columna.classList.add("col", "p-2");
        imagen = document.createElement("img");
        imagen.src = `https://image.tmdb.org/t/p/w500${elemento.poster_path}`;
        imagen.classList.add("img-fluid", "m-2", "rounded", "mx-auto", "d-block");
        atributo = document.createAttribute("title");
        atributo.value = elemento.title;
        imagen.setAttributeNode(atributo);
        atributo = document.createAttribute("alt");
        atributo.value = elemento.title;
        imagen.setAttributeNode(atributo)

        atributo = document.createAttribute("data-bs-toggle");
        atributo.value = "modal";
        imagen.setAttributeNode(atributo);

        atributo = document.createAttribute("data-bs-target");
        atributo.value = "#exampleModal";
        imagen.setAttributeNode(atributo);

        atributo = document.createAttribute("loading");
        atributo.value = "lazy";
        imagen.setAttributeNode(atributo);

        //añadir el click
        imagen.addEventListener("click", function () {
            datosPelicula(elemento.id);
        });

        fila.appendChild(columna).appendChild(imagen);
    });

    padre.appendChild(fila);
    /* PAGINADO */
    /*let paginas=mostrarPaginas(categoria,resultados.page,resultados.total_pages);
    paginado= document.createElement("div");
    paginado.classList.add("row","justify-content-center");
    paginado.innerHTML=paginas;
    padre.appendChild(paginado);*/
}

//Datos película
function datosPelicula(idPelicula) {
    node = document.getElementById("imgCardPelicula");
    node.src = ``;
    fetch(`https://api.themoviedb.org/3/movie/${idPelicula}?language=es`, requestOptions)
        .then(response => response.json())
        .then(result => actualizarTarjeta(result))
        .catch(error => console.log('error', error));
}

function actualizarTarjeta(resultados) {
    node = document.getElementById("imgCardPelicula");
    node.src = `https://image.tmdb.org/t/p/original${resultados.backdrop_path}`;
    atributo = document.createAttribute("alt");
    atributo.value = resultados.title;
    node.setAttributeNode(atributo)

    node = document.getElementById("tituloCardPelicula");
    node.innerHTML = resultados.title
    node = document.getElementById("contenidoCardPelicula");
    node.innerHTML = resultados.overview
    node = document.getElementById("metaCardPelicula");
    meta = `Fecha Lanzamiento:${resultados.release_date}      `;
    resultados.genres.forEach(genero => {
        meta += "   |  " + genero.name.toUpperCase();
    });

    node.innerHTML = meta;
}



//CreaItem menú dropdown categorias

function crearItemMenu(elemento) {
    padreMenu = document.getElementById("menuCategorias");
    let cadena = `<li><a onclick="generarPeliculasJSON(${elemento.id},${paginaActual})" class="dropdown-item" href="#">${elemento.name}</a></li>`;
    padreMenu.innerHTML += cadena;
}



//Mostrar paginas (ya no se usa con carga progresiva)
function mostrarPaginas(categoria, paginaActual, paginasTotales) {
    cadena = `<nav aria-label="Pagina navegacionn categoria">
                <ul class="pagination justify-content-center">`;
    if (paginaActual > 1) {
        cadena += `<li onclick="generarPeliculasJSON(${categoria},${paginaActual - 1});" class="page-item"><a class="page-link" href="#">«</a></li>`;
    } else {
        cadena += `<li class="page-item disabled"><a class="page-link">«</a></li>`;
    }
    cadena += `<li class="page-item"><a class="page-link">${paginaActual} de ${paginasTotales}</a></li>`;

    if (paginaActual < paginasTotales) {
        cadena += `<li onclick="generarPeliculasJSON(${categoria},${paginaActual + 1});" class="page-item"><a class="page-link" href="#">»</a></li>`;
    } else {
        cadena += `<li class="page-item disabled"><a class="page-link">»</a></li>`;
    }
    cadena += `</ul></nav> `
    return cadena;
}