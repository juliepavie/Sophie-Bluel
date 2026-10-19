console.log("script.js loaded");

const galerie = document.querySelector(".gallery");
console.log(galerie);

let allProjects = [];

fetch("http://localhost:5678/api/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (projects) {
        displayProjects(projects);
        allProjects = projects;
    })
    .catch(function (error) {
        console.error("impossible de récupérer les projets :", error);
    });

function displayProjects(projects) {

    galerie.replaceChildren();

    projects.forEach(function (project) {

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
}

const filters = document.querySelector(".filters");

const allButton = document.createElement("button");
allButton.type = "button";
allButton.textContent = "Tous";
allButton.classList.add("active");

filters.appendChild(allButton);
allButton.addEventListener("click", function () {
    setActiveButton(allButton);
    displayProjects(allProjects);

});

fetch("http://localhost:5678/api/categories")
    .then(function (response) {
        return response.json();
    })
    .then(function (categories) {
        categories.forEach(function (category) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = category.name;
            button.addEventListener("click", function () {
                setActiveButton(button);
                
                const filteredProjects = allProjects.filter(function (project) {
                    return project.categoryId === category.id;
                });
                displayProjects(filteredProjects);

            });
            filters.appendChild(button);
        });
    })

    .catch(function (error) {
        console.error("impossible de récupérer les catégories :", error);
    });

function setActiveButton(selectedButton) {
    filters.querySelectorAll("button").forEach(function (button) {
        button.classList.remove("active");
    });
    selectedButton.classList.add("active");
}