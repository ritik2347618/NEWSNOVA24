// ======================================================
// NEWSNOVA24 - SECURE ADMIN LOGIN
// SERVER SESSION VERSION
// ======================================================


// ======================================================
// HTML ELEMENTS
// ======================================================

const loginForm =
    document.getElementById("admin-login-form");

const usernameInput =
    document.getElementById("admin-username");

const passwordInput =
    document.getElementById("admin-password");

const loginError =
    document.getElementById("login-error");

const loginErrorText =
    document.getElementById("login-error-text");

const togglePassword =
    document.getElementById("toggle-password");

const passwordEye =
    document.getElementById("password-eye");


// ======================================================
// SHOW / HIDE PASSWORD
// ======================================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                if (passwordEye) {

                    passwordEye.classList.remove(
                        "fa-eye"
                    );

                    passwordEye.classList.add(
                        "fa-eye-slash"
                    );

                }

            } else {

                passwordInput.type = "password";

                if (passwordEye) {

                    passwordEye.classList.remove(
                        "fa-eye-slash"
                    );

                    passwordEye.classList.add(
                        "fa-eye"
                    );

                }

            }

        }
    );

}


// ======================================================
// SHOW LOGIN ERROR
// ======================================================

function showLoginError(message) {

    if (loginErrorText) {

        loginErrorText.textContent =
            message;

    }


    if (loginError) {

        loginError.style.display =
            "block";

    }

}


// ======================================================
// LOGIN FORM SUBMIT
// ======================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;


            // Empty fields

            if (!username || !password) {

                showLoginError(
                    "Please enter username and password."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "/api/admin/login",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    username:
                                        username,

                                    password:
                                        password

                                })

                        }
                    );


                const result =
                    await response.json();


                // Wrong username/password

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Invalid username or password"
                    );

                }


                // Hide error

                if (loginError) {

                    loginError.style.display =
                        "none";

                }


                // Successful login

                window.location.href =
                    "admin.html";


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                showLoginError(
                    error.message
                );


                passwordInput.value =
                    "";


                passwordInput.focus();

            }

        }
    );

}


// ======================================================
// CHECK IF ALREADY LOGGED IN
// ======================================================

async function checkExistingSession() {

    try {

        const response =
            await fetch(
                "/api/admin/check"
            );


        if (response.ok) {

            const result =
                await response.json();


            if (result.loggedIn) {

                window.location.href =
                    "admin.html";

            }

        }


    } catch (error) {

        console.log(
            "No active admin session."
        );

    }

}


// Check session when login page opens

checkExistingSession();