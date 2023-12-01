let myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjE0ZDc2NTUzZTI1NWYxYTY2YTQ2M2E5YWVlZjkzMCIsInN1YiI6IjY1M2Y3NThlY2M5NjgzMDBjOWU1MDEwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FqH5iyYw7QDd-7ZydOPSYQ2UH_hA4OcEeF6JUK-Iz3M");

let requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
let listaCategorias= new Array();

generarCategoriasJSON(); //Se ejecuta al principio para que aparezcan las categoría




function generarCategoriasJSON(){
  fetch("https://api.themoviedb.org/3/genre/movie/list?language=es", requestOptions)
  .then(response => response.json())
  .then(result => mostrarCategorias(result))
  .catch(error => console.log('error', error));
}

function generarPeliculasJSON(categoria,pagina){
    fetch(`https://api.themoviedb.org/3/discover/movie?language=es&with_genres=${categoria}&page=${pagina}`, requestOptions)
    .then(response => response.json())
    .then(result => mostrarPeliculas(result,categoria))
    .catch(error => console.log('error', error));
  }


function mostrarCategorias(resultados){
    listaCategorias=[];
    padre = document.getElementById("contenido");
    padre.innerHTML="";
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-4", "justify-content-center");
    resultados.genres.forEach(elemento => {
        columna=document.createElement("div");
        columna.classList.add("col","p-2");
        boton = document.createElement("button");
        boton.classList.add("btn","btn-primary","w-100");
        atributo = document.createAttribute("type");
        atributo.value="button";
        boton.setAttributeNode(atributo);     
        atributo = document.createAttribute("title");
        atributo.value=elemento.name;
        boton.setAttributeNode(atributo); 
        boton.innerHTML=`${elemento.name}`;
        //añadir el click
        boton.addEventListener("click",function(){
           generarPeliculasJSON(elemento.id,1);
        });
        fila.appendChild(columna).appendChild(boton);     
        //crear elemento dropdownMenu
        crarItemMenu(elemento);
        listaCategorias.push(elemento);
    });

    padre.appendChild(fila);
}


//Motrar Peliculas
function mostrarPeliculas(resultados,categoria){
    padre = document.getElementById("contenido");
    padre.innerHTML="";
    fila = document.createElement("div");
    fila.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-4", "justify-content-center");
    resultados.results.forEach(elemento => {
        columna=document.createElement("div");
        columna.classList.add("col","p-2");
        imagen = document.createElement("img");
        imagen.src=`https://image.tmdb.org/t/p/w500${elemento.poster_path}`;
        imagen.classList.add("img-fluid","m-2","rounded","mx-auto","d-block");
        atributo = document.createAttribute("title");
        atributo.value=elemento.title;
        imagen.setAttributeNode(atributo); 
        atributo = document.createAttribute("alt");
        atributo.value=elemento.title;
        imagen.setAttributeNode(atributo)
        fila.appendChild(columna).appendChild(imagen);     
    });

    padre.appendChild(fila);
    let paginas=mostrarPaginas(categoria,resultados.page,resultados.total_pages);
    paginado= document.createElement("div");
    paginado.classList.add("row","justify-content-center");
    paginado.innerHTML=paginas;
    padre.appendChild(paginado);
}


//CreaItem menú dropdown categorias

function crarItemMenu(elemento){
    padreMenu = document.getElementById("menuCategorias");
    let cadena=`<li><a onclick="generarPeliculasJSON(${elemento.id})" class="dropdown-item" href="#">${elemento.name}</a></li>`;
    padreMenu.innerHTML += cadena;
}



//Mostrar paginas
function mostrarPaginas(categoria,paginaActual,paginasTotales){
    cadena =`<nav aria-label="Pagina navegacionn categoria">
                <ul class="pagination justify-content-center">`;
    if (paginaActual>1){
        cadena+=`<li onclick="generarPeliculasJSON(${categoria},${paginaActual-1});" class="page-item"><a class="page-link" href="#">«</a></li>`;
    } else {
        cadena+=`<li class="page-item disabled"><a class="page-link">«</a></li>`; 
    }
    cadena += `<li class="page-item"><a class="page-link">${paginaActual} de ${paginasTotales}</a></li>`;
    
    if (paginaActual<paginasTotales){
        cadena+=`<li onclick="generarPeliculasJSON(${categoria},${paginaActual+1});" class="page-item"><a class="page-link" href="#">»</a></li>`;
    } else {
        cadena+=`<li class="page-item disabled"><a class="page-link">»</a></li>`; 
    }
   cadena+=`</ul></nav> `
   return cadena;
}