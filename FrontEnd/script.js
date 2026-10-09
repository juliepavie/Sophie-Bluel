console.log("script.js loaded");

const galerie = document.querySelector(".gallery");
console.log(galerie);

fetch("http://localhost:5678/api/works")
.then(function(response) {
    return response.json();
})
.then(function(projects) {

   galerie.replaceChildren();
   
   projects.forEach(function(project) {

   const figure = document.createElement("figure");
   const image = document.createElement("img");
   const legende = document.createElement("figcaption");


   image.src = project.imageUrl;
   image.alt = project.title;
   legende.textContent = project.title;

   figure.appendChild(image);
   figure.appendChild(legende);
   galerie.appendChild(figure);

});
})
.catch(function(error) {
    console.error("impossible de récupérer les projets :", error);
});
