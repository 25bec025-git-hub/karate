-- =========================================================
--  MARTIAL ARTS KARATE ACADEMY — NIT HAMIRPUR
--  DATABASE SCHEMA
-- =========================================================


-- =========================================================
--  CONTACT MESSAGES
--  Stores form submissions from the website contact form.
-- =========================================================

CREATE TABLE IF NOT EXISTS contact_messages (

    id          SERIAL          PRIMARY KEY,

    name        VARCHAR(120)    NOT NULL,

    email       VARCHAR(255)    NOT NULL,

    subject     VARCHAR(255)    NOT NULL,

    message     TEXT            NOT NULL,

    ip_address  VARCHAR(45),                    -- IPv4 or IPv6

    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    is_read     BOOLEAN         NOT NULL DEFAULT FALSE

);


-- Index for quick lookup of unread messages in admin views.
CREATE INDEX IF NOT EXISTS idx_contact_messages_unread
    ON contact_messages (is_read, created_at DESC);


-- =========================================================
--  CADETS  (future use)
-- =========================================================

CREATE TABLE IF NOT EXISTS cadets (

    id          SERIAL          PRIMARY KEY,

    name        VARCHAR(120)    NOT NULL,

    batch_year  SMALLINT        NOT NULL,       -- e.g. 2023

    role        VARCHAR(80),                    -- Coordinator / Cadet

    bio         TEXT,

    image_path  VARCHAR(255),

    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,

    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()

);


-- =========================================================
--  EVENTS  (future use)
-- =========================================================

CREATE TABLE IF NOT EXISTS events (

    id          SERIAL          PRIMARY KEY,

    title       VARCHAR(200)    NOT NULL,

    description TEXT,

    event_date  DATE            NOT NULL,

    image_path  VARCHAR(255),

    link_url    VARCHAR(500),

    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()

);
