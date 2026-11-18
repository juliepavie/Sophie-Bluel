const API_URL = "http://localhost:5678/api";


function getProjects() {
    return fetch(API_URL + "/works")
        .then(function (response) {
            return response.json();
        });
}


function getCategories() {
    return fetch(API_URL + "/categories")
        .then(function (response) {
            return response.json();
        });
}


// Fonction pour se connecter à l'API avec un email et un mot de passe

function loginUser(email, password) {
    return fetch(API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
}

//demande de suppression d'un projet a l'API

function deleteProject(id, token) {
    return fetch(API_URL + "/works/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token

        }
    }).then(function (response) {
        if (!response.ok) {
            throw new Error("Impossible de supprimer le projet");
        }

        return response;
    });
}


//envoi d'un nouveau projet a l'API

function addProject(formData, token) {
    return fetch(API_URL + "/works", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token
        },
        body: formData
    }).then(function (response) {
        if (!response.ok) {
            throw new Error("Impossible d'ajouter le projet");
        }

        return response.json();
    });
}