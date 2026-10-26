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



function loginUser(email, password) {
    return fetch(API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
}   
