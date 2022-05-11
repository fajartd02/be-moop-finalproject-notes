CREATE DATABASE note_database;

--\c into note_database

CREATE TABLE note(
    note_id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    content varchar(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);