let myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjE0ZDc2NTUzZTI1NWYxYTY2YTQ2M2E5YWVlZjkzMCIsInN1YiI6IjY1M2Y3NThlY2M5NjgzMDBjOWU1MDEwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FqH5iyYw7QDd-7ZydOPSYQ2UH_hA4OcEeF6JUK-Iz3M");

let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};
let listaCategorias = new Array();
let paginaActual = 1;
let paginasTotales = 1;
let categoriaActual = 0;

generarCategoriasJSON(); //Se ejecuta al principio para que aparezcan las categoría



//Controlar el final de la página para carga progresiva...
window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

        if (paginaActual <= paginasTotales && categoriaActual > 0) {
            paginaActual++;
            generarPeliculasJSON(categoriaActual, paginaActual);
        }
    }
    scrollFunction();
};



/* GESTIONAR LAS CATEGORIAS */

//Recoger el JSON vía AJAX petición API REST
function generarCategoriasJSON() {
    paginaActual = 1;
    paginasTotales = 1;
    categoriaActual = 0;

    fetch("https://api.themoviedb.org/3/genre/movie/list?language=es", requestOptions)
        .then(response => response.json())
        .then(result => mostrarCategorias(result))
        .catch(error => console.log('error', error));
}

//Mostrar los botones y actualizar menú
function mostrarCategorias(resultados, categoria) {
    listaCategorias = [];
    paginaActual = 1;
    padre = document.getElementById("contenido");
    padre.innerHTML = "";
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-2", "row-cols-md-4", "justify-content-center");
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
        boton.innerHTML = `<img src="img/iconos/${elemento.id}.png" alt="${elemento.name}" class="iconoCategoria"><p>${elemento.name}</p>`;
        //añadir el click
        boton.addEventListener("click", function () {
            generarPeliculasJSON(elemento.id, paginaActual);
            categoriaActual = elemento.id;
        });


        columna.appendChild(boton);
        fila.appendChild(columna);
        //crear elemento dropdownMenu
        crearItemMenu(elemento);
        listaCategorias.push(elemento);
    });

    padre.appendChild(fila);
}


//CreaItem menú dropdown categorias
function crearItemMenu(elemento) {
    padreMenu = document.getElementById("menuCategorias");
    let cadena = `<li><a onclick="generarPeliculasJSON(${elemento.id},${paginaActual})" class="dropdown-item" href="#">${elemento.name}</a></li>`;
    padreMenu.innerHTML += cadena;
}




/* GESTIONAR LAS PELÍCULAS */

//Recoger datos de la categoría y página correspondiente para hacer petición API REST
function generarPeliculasJSON(categoria, pagina) {
    paginaActual = pagina;
    categoriaActual = categoria;
    fetch(`https://api.themoviedb.org/3/discover/movie?language=es&with_genres=${categoria}&page=${pagina}`, requestOptions)
        .then(response => response.json())
        .then(result => mostrarPeliculas(result, categoria))
        .catch(error => console.log('error', error));
}

//Mostrar Pelicula - carteles
function mostrarPeliculas(resultados, categoria) {
    paginasTotales = resultados.total_pages;
    padre = document.getElementById("contenido");
    if (paginaActual == 1) {
        padre.innerHTML = "";
        fila = document.createElement("div");
        fila.classList.add("row", "row-cols-1", "justify-content-center");
        let cat = listaCategorias.find(obj => {
            return obj.id === categoriaActual
        });
        fila.innerHTML = `<h1 class="text-center">${cat.name}</h1>`;
        padre.appendChild(fila);
    }
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-2", "row-cols-md-4", "justify-content-center");
    resultados.results.forEach(elemento => {
        columna = document.createElement("div");
        columna.classList.add("col", "p-2");
        imagen = document.createElement("img");
        imagen.src = `https://image.tmdb.org/t/p/w500${elemento.poster_path}`;
        imagen.classList.add("img-fluid", "m-2", "rounded", "mx-auto", "d-block", "w-75", "md-w-100");
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

}

//Datos película para ventana modal
function datosPelicula(idPelicula) {
    node = document.getElementById("imgCardPelicula");
    node.src = ``;
    fetch(`https://api.themoviedb.org/3/movie/${idPelicula}?language=es`, requestOptions)
        .then(response => response.json())
        .then(result => actualizarTarjeta(result))
        .catch(error => console.log('error', error));
}

//Actualizar la tarjeta de la ventana moda
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



/* GESTIONAR LAS PELÍCULAS DE LA PORTADA */

//Recoger datos de la categoría y página correspondiente para hacer petición API REST
function cargarPortadaJSON() {
    paginaActual = 1;
    paginasTotales = 1;
    categoriaActual = 0;

    fetch(`https://api.themoviedb.org/3/movie/upcoming?language=es`, requestOptions)
        .then(response => response.json())
        .then(result => mostrarPortada(result))
        .catch(error => console.log('error', error));
}


function mostrarPortada(resultados) {
    padre = document.getElementById("contenido");
    padre.innerHTML = "";

    //fila titulo portada
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-1", "justify-content-center");
   

    let contador=0;
    let contenido = ` <div id="carouselPortada" class="carousel slide" data-bs-ride="carousel">
                     <div class="carousel-inner">`;

    resultados.results.forEach(elemento => {
        contador++;
        if (contador==1) {
            contenido+=`<div class="carousel-item active">`;
        }else {
            contenido+=`<div class="carousel-item">`;
        }
        contenido +=`<img src="https://image.tmdb.org/t/p/original${elemento.backdrop_path}" class="imgCarousel w-100 object-fit-cover" alt="${elemento.title}">
             <div class="carousel-caption divCaption">
                 <h5 class="captionCarousel">${elemento.title}</h5>
            </div>
         </div>`;
        
    });

    contenido +=`</div >
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselPortada" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselPortada" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                </button>
                </div >`;
    fila.innerHTML = `<h1 class="text-center">Novedades en D'PELIS</h1>` + contenido;
    padre.appendChild(fila);
    
}


/* GESTIONAR LAS PELÍCULAS DE LA PORTADA */

//Recoger datos de la categoría y página correspondiente para hacer petición API REST
function generarTopJSON() {
    paginaActual = 1;
    paginasTotales = 1;
    categoriaActual = 0;

    fetch(`https://api.themoviedb.org/3/movie/top_rated?language=es&page=1`, requestOptions)
        .then(response => response.json())
        .then(result => mostrarTop(result))
        .catch(error => console.log('error', error));
}


function mostrarTop(resultados) {
    padre = document.getElementById("contenido");
    padre.innerHTML = "";
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-1", "justify-content-center");
    fila.innerHTML = `<h1 class="text-center">PELÍCULAS MEJOR VALORADAS</h1>`;
    padre.appendChild(fila);
    
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-2", "row-cols-md-4", "justify-content-center");
    resultados.results.forEach(elemento => {
        columna = document.createElement("div");
        columna.classList.add("col", "p-2");
        imagen = document.createElement("img");
        imagen.src = `https://image.tmdb.org/t/p/w500${elemento.poster_path}`;
        imagen.classList.add("img-fluid", "m-2", "rounded", "mx-auto", "d-block", "w-75", "md-w-100");
        atributo = document.createAttribute("title");
        atributo.value = elemento.title;
        imagen.setAttributeNode(atributo);
        atributo = document.createAttribute("alt");
        atributo.value = elemento.title;
        imagen.setAttributeNode(atributo);

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
        
        votos = document.createElement("span");
        votos.classList.add("position-absolute","top-0","start-100","translate-middle","badge","rounded-pill","bg-danger");
        votos.innerHTML=elemento.vote_average;
        columna.appendChild(votos);
        columna.appendChild(imagen);
        fila.appendChild(columna)
    });

    padre.appendChild(fila);
    
}

