require("dotenv").config();

const dns = require("dns");

// ======================================================
// DNS CONFIG
// ======================================================

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
// CHECK IMPORTANT ENV VARIABLES
// ======================================================

const requiredEnvVariables = [
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD",
    "SESSION_SECRET",
    "MONGODB_URI"
];

const missingEnvVariables =
    requiredEnvVariables.filter(
        (variable) => !process.env[variable]
    );

if (missingEnvVariables.length > 0) {

    console.error(
        "❌ Missing environment variables:",
        missingEnvVariables.join(", ")
    );

    process.exit(1);
}


// ======================================================
// SECURITY HEADERS
// ======================================================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);


// ======================================================
// TRUST PROXY
// Required for Render / HTTPS
// ======================================================

app.set("trust proxy", 1);


// ======================================================
// BODY MIDDLEWARE
// ======================================================

app.use(express.json({ limit: "10mb" }));

app.use(
    express.urlencoded({
        extended: true
    })
);


// ======================================================
// SESSION
// ======================================================

app.use(
    session({

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,

            sameSite: "lax",

            secure:
                process.env.NODE_ENV === "production",

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

        try {

            const username =
                String(
                    req.body.username || ""
                ).trim();

            const password =
                String(
                    req.body.password || ""
                );


            // ==========================================
            // EMPTY FIELD CHECK
            // ==========================================

            if (!username || !password) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Username and password are required"
                    });
            }


            // ==========================================
            // GET ADMIN DETAILS FROM .ENV
            // ==========================================

            const adminUsername =
                String(
                    process.env.ADMIN_USERNAME || ""
                ).trim();

            const adminPassword =
                String(
                    process.env.ADMIN_PASSWORD || ""
                );


            // ==========================================
            // LOGIN CHECK
            // ==========================================

            if (
                username === adminUsername &&
                password === adminPassword
            ) {

                // Create admin session
                req.session.isAdmin = true;


                // Save session before response
                req.session.save(
                    (error) => {

                        if (error) {

                            console.error(
                                "Session Save Error:",
                                error
                            );


                            return res
                                .status(500)
                                .json({

                                    success: false,

                                    message:
                                        "Unable to create login session"
                                });
                        }


                        return res
                            .status(200)
                            .json({

                                success: true,

                                loggedIn: true,

                                message:
                                    "Login successful"
                            });
                    }
                );


                return;
            }


            // ==========================================
            // WRONG LOGIN
            // ==========================================

            return res
                .status(401)
                .json({

                    success: false,

                    loggedIn: false,

                    message:
                        "Invalid username or password"
                });


        } catch (error) {

            console.error(
                "Admin Login Error:",
                error
            );


            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Internal server error"
                });
        }
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
            req.session.isAdmin === true
        ) {

            return res
                .status(200)
                .json({

                    success: true,

                    loggedIn: true
                });
        }


        return res
            .status(401)
            .json({

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

        if (!req.session) {

            return res
                .status(200)
                .json({

                    success: true,

                    message:
                        "Already logged out"
                });
        }


        req.session.destroy(
            (error) => {

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
    (req, res) => {

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

        console.error(
            "MongoDB Connection Failed ❌"
        );

        console.error(
            "Error Name:",
            error.name
        );

        console.error(
            "Error Message:",
            error.message
        );

        console.error(
            "Error Code:",
            error.code
        );
    });


// ======================================================
// 404 PAGE
// Keep this after all routes
// ======================================================

app.use(
    (req, res) => {

        res
            .status(404)
            .sendFile(
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
    () => {

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
            process.env.NODE_ENV ||
            "development"
        );

        console.log(
            "Admin credentials loaded:",
            process.env.ADMIN_USERNAME &&
            process.env.ADMIN_PASSWORD
                ? "YES ✅"
                : "NO ❌"
        );

        console.log(
            "-------------------------------------"
        );
    }
);