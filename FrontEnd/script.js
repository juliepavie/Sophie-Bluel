const token = localStorage.getItem("token");

console.log("script.js loaded");



const galerie = document.querySelector(".gallery");
console.log(galerie);

let allProjects = [];

getProjects()

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

// Création des boutons de filtre

const filters = document.createElement("div");
filters.classList.add("filters");

function filtersCategories() {
    const portfolio = document.querySelector("#portfolio");
    const allButton = document.createElement("button");
    portfolio.insertBefore(filters, portfolio.children[1]);
    allButton.type = "button";
    allButton.textContent = "Tous";
    allButton.classList.add("active");

    filters.appendChild(allButton);
    allButton.addEventListener("click", function () {
        setActiveButton(allButton);
        displayProjects(allProjects);

    });

    getCategories()

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
}


function setActiveButton(selectedButton) {
    filters.querySelectorAll("button").forEach(function (button) {
        button.classList.remove("active");
    });
    selectedButton.classList.add("active");
}


if (token) {

    const body = document.querySelector("body");
    const authBanner = document.createElement("div");

    authBanner.classList.add("auth-banner");
    authBanner.innerHTML = `<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i> Mode édition `;
    body.insertBefore(authBanner, body.firstChild);

    const authLink = document.querySelector(".auth-link");
    authLink.textContent = "logout";

    authLink.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "./index.html";
    });

    const portfolioHeading = document.querySelector(".portfolio-heading");
    const editProjects = document.createElement("button");

    editProjects.classList.add("edit-projects");
    portfolioHeading.appendChild(editProjects);
    editProjects.innerHTML = `<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i> Modifier`;


    const projectsModal = document.querySelector(".projects-modal");

    const modalContent = projectsModal.querySelector(".modal-content");

    function displayModalGallery() {
        modalContent.replaceChildren();

        projectsModal.querySelector("h2").textContent = "Galerie photo";


        const modalGallery = document.createElement("div");
        modalGallery.classList.add("modal-gallery");

        const addPhotoButton = document.createElement("button");
        addPhotoButton.type = "button";
        addPhotoButton.classList.add("add-photo");
        addPhotoButton.textContent = "Ajouter une photo";

        addPhotoButton.addEventListener("click", function () {
            displayAddProjectForm();
        });


        // Création des cartes de projet dans la modale

        allProjects.forEach(function (project) {

            const projectCard = document.createElement("div");
            projectCard.classList.add("modal-project");

            const image = document.createElement("img");
            image.src = project.imageUrl;
            image.alt = project.title;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("delete-project");
            deleteButton.setAttribute("aria-label", "Supprimer" + project.title);

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash-can");
            deleteIcon.setAttribute("aria-hidden", "true");

            deleteButton.appendChild(deleteIcon);

            deleteButton.addEventListener("click", function () {
                deleteButton.disabled = true;

                deleteProject(project.id, token)
                    .then(function () {
                        allProjects = allProjects.filter(function (item) {
                            return item.id !== project.id;

                        });

                        displayProjects(allProjects);
                        displayModalGallery();

                    })

                    .catch(function (error) {
                        deleteButton.disabled = false;
                        console.error(error);
                        alert("Le projet n'a pas pu etre supprimé.");
                    });

            });

            projectCard.appendChild(image);
            projectCard.appendChild(deleteButton);
            modalGallery.appendChild(projectCard);
        });

        modalContent.appendChild(modalGallery);
        modalContent.appendChild(addPhotoButton);
    }

    function displayAddProjectForm() {
        modalContent.replaceChildren();
        projectsModal.querySelector("h2").textContent = "Ajout photo";

        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.classList.add("back-modal");
        backButton.setAttribute("aria-label", "Retour à la galerie");

        const backIcon = document.createElement("i");
        backIcon.classList.add("fa-solid", "fa-arrow-left");
        backIcon.setAttribute("aria-hidden", "true");

        backButton.appendChild(backIcon);

        backButton.addEventListener("click", function () {
            displayModalGallery();
        });

        modalContent.appendChild(backButton);

        const form = document.createElement("form");
        form.classList.add("add-project-form");

        const photoLabel = document.createElement("label");
        photoLabel.classList.add("photo-upload");

        const photoInput = document.createElement("input");
        photoInput.type = "file";
        photoInput.accept = "image/jpeg, image/png";
        photoInput.required = true;
        photoInput.classList.add("project-image");

        const photoIcon = document.createElement("i");
        photoIcon.classList.add("fa-regular", "fa-image");
        photoIcon.setAttribute("aria-hidden", "true");

        photoLabel.appendChild(photoIcon);

        const photoText = document.createElement("span");
        photoText.textContent = "+ Ajouter une photo";
        photoText.classList.add("photo-upload-text");

        photoLabel.appendChild(photoText);

        const photoInfo = document.createElement("span");
        photoInfo.textContent = "jpg, png : 4mo max";
        photoInfo.classList.add("photo-upload-info");

        photoLabel.appendChild(photoInfo);
        photoLabel.appendChild(photoInput);
        form.appendChild(photoLabel);


        //Aperçu image 

        photoInput.addEventListener("change", function () {
            const file = photoInput.files[0];

            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.addEventListener("load", function () {
                const preview = document.createElement("img");
                preview.src = reader.result;
                preview.alt = "aperçu de la photo sélectionnée";
                preview.classList.add("photo-preview");


                photoLabel.replaceChildren(preview, photoInput);
                photoInput.setAttribute("aria-label", "Changer la photo");

            });

            reader.readAsDataURL(file);

        });






        //champ titre

        const titleLabel = document.createElement("label");
        titleLabel.textContent = "Titre";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.required = true;
        titleInput.classList.add("project-title");

        titleLabel.appendChild(titleInput);
        form.appendChild(titleLabel);

        modalContent.appendChild(form);

        //champ catégorie
        const categoryLabel = document.createElement("label");
        categoryLabel.textContent = "Catégorie";

        const categorySelect = document.createElement("select");
        categorySelect.classList.add("project-category");
        categorySelect.required = true;

        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "Choisir une catégorie";

        categorySelect.appendChild(emptyOption);
        categoryLabel.appendChild(categorySelect);
        form.appendChild(categoryLabel);


        // Récupération des catégories depuis l'API
        getCategories()
            .then(function (categories) {
                categories.forEach(function (category) {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(function (error) {
                console.error("impossible de récupérer les catégories :", error);
            });


        //bouton valider

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Valider";
        submitButton.classList.add("validate-project");
        submitButton.disabled = true;


        const separator = document.createElement("hr");
        separator.classList.add("form-separator");


        form.appendChild(separator);
        form.appendChild(submitButton);

        //
    }

    editProjects.addEventListener("click", function () {
        displayModalGallery();
        projectsModal.showModal();

    });


    const closeModalButton = document.querySelector(".close-modal");

    closeModalButton.addEventListener("click", function () {
        projectsModal.close();
    });

} else {
    filtersCategories();

}










