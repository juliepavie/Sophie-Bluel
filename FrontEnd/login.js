const loginForm = document.querySelector(".login form");
const loginError = document.querySelector(".login-error");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    loginError.textContent = "";

    const email = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    loginUser(email, password)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("E-mail ou mot de passe incorrect");
            }
            return response.json();
            })
        .then(function (data) {
            localStorage.setItem("token", data.token);
            window.location.href = "./index.html";
        })
        .catch(function (error) {
            console.error("Erreur lors de la connexion :", error.message);
            loginError.textContent = "E-mail ou mot de passe incorrect";
        });
    });