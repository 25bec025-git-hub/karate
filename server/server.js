"use strict";

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5500",
        credentials: true
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


/* =========================================================
   SERVE FRONTEND
========================================================= */

const clientPath = path.join(
    __dirname,
    "..",
    "client"
);

app.use(
    express.static(clientPath)
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Martial Arts Karate Academy API is running",
            environment:
                process.env.NODE_ENV || "development"
        });

    }
);


/* =========================================================
   ROOT ROUTE
========================================================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                clientPath,
                "index.html"
            )
        );

    }
);


/* =========================================================
   404 API HANDLER
========================================================= */

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({
            success: false,
            message: "API route not found"
        });

    }
);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
    (err, req, res, next) => {

        console.error(err);

        res.status(
            err.status || 500
        ).json({
            success: false,
            message:
                err.message ||
                "Internal server error"
        });

    }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);