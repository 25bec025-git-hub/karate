"use strict";

const pool = require("../config/db");


/* =========================================================
   SUBMIT CONTACT FORM
   POST /api/contact
========================================================= */

async function submitContact(req, res, next) {

    try {

        const { name, email, subject, message } = req.body;


        /* -------------------------------------------------
           INPUT VALIDATION
        ------------------------------------------------- */

        const errors = [];

        if (
            !name ||
            typeof name !== "string" ||
            name.trim().length < 2
        ) {
            errors.push("Name must be at least 2 characters.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !email ||
            !emailRegex.test(email.trim())
        ) {
            errors.push("A valid email address is required.");
        }

        if (
            !subject ||
            typeof subject !== "string" ||
            subject.trim().length < 2
        ) {
            errors.push("Subject is required.");
        }

        if (
            !message ||
            typeof message !== "string" ||
            message.trim().length < 10
        ) {
            errors.push("Message must be at least 10 characters.");
        }

        if (errors.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors
            });

        }


        /* -------------------------------------------------
           SAVE TO DATABASE
        ------------------------------------------------- */

        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
            req.socket?.remoteAddress ||
            null;

        const result = await pool.query(
            `INSERT INTO contact_messages
                (name, email, subject, message, ip_address)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, created_at`,
            [
                name.trim(),
                email.trim().toLowerCase(),
                subject.trim(),
                message.trim(),
                ip
            ]
        );

        const saved = result.rows[0];

        console.log(
            `New contact message #${saved.id} from ${email.trim()} at ${saved.created_at}`
        );


        /* -------------------------------------------------
           RESPONSE
        ------------------------------------------------- */

        return res.status(201).json({
            success: true,
            message: "Thank you for reaching out! We will get back to you soon.",
            data: {
                id:         saved.id,
                created_at: saved.created_at
            }
        });


    } catch (err) {

        next(err);

    }

}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    submitContact
};
