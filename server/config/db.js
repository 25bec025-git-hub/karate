"use strict";

const { Pool } = require("pg");


/* =========================================================
   POSTGRESQL CONNECTION POOL
========================================================= */

const pool = new Pool({
    host:     process.env.DB_HOST     || "localhost",
    port:     Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME     || "karate_academy",
    user:     process.env.DB_USER     || "postgres",
    password: process.env.DB_PASSWORD || "",

    /*
        Keep a small pool; the site is low-traffic.
        Increase max if needed.
    */
    max:             10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});


/* =========================================================
   TEST CONNECTION ON STARTUP
========================================================= */

pool.connect((err, client, release) => {

    if (err) {
        console.error("Database connection error:", err.message);
        return;
    }

    console.log("Connected to PostgreSQL database");
    release();

});


/* =========================================================
   EXPORTS
========================================================= */

module.exports = pool;
