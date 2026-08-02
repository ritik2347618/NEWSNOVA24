require("dotenv").config();

const dns = require("dns");

// MongoDB DNS fix
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


// ======================================================
// NEWSNOVA24 - NODE.JS SERVER
// ======================================================

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");

const newsRoutes = require("./routes/newsRoutes");

// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

const PORT = process.env.PORT || 3000;

// ======================================================
// SECURITY HEADERS - HELMET
// ======================================================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);


// ======================================================
// TRUST PROXY
// Live hosting / HTTPS ke liye
// ======================================================

app.set("trust proxy", 1);


// ======================================================
// BODY MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ======================================================
// SECURE SESSION
// ======================================================

app.use(
    session({

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {

            // Browser JavaScript cookie ko read nahi kar sakega
            httpOnly: true,

            // Basic CSRF protection
            sameSite: "lax",

            // Localhost = false
            // Live production HTTPS = true
            secure:
                process.env.NODE_ENV === "production",

            // Session 24 hours tak valid
            maxAge:
                24 * 60 * 60 * 1000

        }

    })
);


// ======================================================
// ADMIN LOGIN API
// ======================================================

app.post(
    "/api/admin/login",
    (req, res) => {

        const {
            username,
            password
        } = req.body;


        if (
            username ===
                process.env.ADMIN_USERNAME
            &&
            password ===
                process.env.ADMIN_PASSWORD
        ) {

            // Admin login session
            req.session.isAdmin = true;


            return res.status(200).json({

                success: true,

                message:
                    "Login successful"

            });

        }


        return res.status(401).json({

            success: false,

            message:
                "Invalid username or password"

        });

    }
);


// ======================================================
// CHECK ADMIN SESSION
// ======================================================

app.get(
    "/api/admin/check",
    (req, res) => {

        if (
            req.session &&
            req.session.isAdmin
        ) {

            return res.status(200).json({

                success: true,

                loggedIn: true

            });

        }


        return res.status(401).json({

            success: false,

            loggedIn: false,

            message:
                "Admin login required"

        });

    }
);


// ======================================================
// ADMIN LOGOUT
// ======================================================

app.post(
    "/api/admin/logout",
    (req, res) => {

        req.session.destroy(
            function (error) {

                if (error) {

                    console.error(
                        "Logout Error:",
                        error
                    );


                    return res
                        .status(500)
                        .json({

                            success: false,

                            message:
                                "Logout failed"

                        });

                }


                res.clearCookie(
                    "connect.sid",
                    {
                        httpOnly: true,
                        sameSite: "lax",
                        secure:
                            process.env.NODE_ENV ===
                            "production"
                    }
                );


                return res
                    .status(200)
                    .json({

                        success: true,

                        message:
                            "Logout successful"

                    });

            }
        );

    }
);


// ======================================================
// NEWS API
// ======================================================

app.use(
    "/api/news",
    newsRoutes
);


// ======================================================
// STATIC FILES
// ======================================================

app.use(
    express.static(__dirname)
);


// ======================================================
// HOME PAGE
// ======================================================

app.get(
    "/",
    function (req, res) {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }
);


// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
    .connect(
        process.env.MONGODB_URI
    )

    .then(() => {

        console.log(
            "MongoDB Connected Successfully ✅"
        );

    })

    .catch((error) => {

        console.log(
            "MongoDB Connection Failed ❌"
        );


        console.log(
            "Error Name:",
            error.name
        );


        console.log(
            "Error Message:",
            error.message
        );


        console.log(
            "Error Code:",
            error.code
        );

    });


// ======================================================
// 404 - PAGE NOT FOUND
// IMPORTANT: Isko sabhi routes ke baad hi rehne dena
// ======================================================

app.use(
    (req, res) => {

        res.status(404).sendFile(
            path.join(
                __dirname,
                "404.html"
            )
        );

    }
);


// ======================================================
// SERVER START
// ======================================================

app.listen(
    PORT,
    function () {

        console.log(
            "-------------------------------------"
        );


        console.log(
            "NEWSNOVA24 Server Started Successfully"
        );


        console.log(
            "Server running on port:",
            PORT
        );


        console.log(
            "Environment:",
            process.env.NODE_ENV || "development"
        );


        console.log(
            "-------------------------------------"
        );

    }
);