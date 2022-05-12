# Hydra Team
- Fajar Muhammad Hamka
- Rahmat Syifana Jaelani
- Julian Alifirman Wardana
- Andros C.C
- Leonardo

# How to run Backend
- Make sure you have install the postgreSQL and put in your environment PATH
- Open your terminal (CMD or etc)
- Paste it
```
psql -U postgres
```
Then enter your password
- After that, you can create the database first and the sql you can see in the folder models/database.sql
- Or for alternative, you can follow this instruction
```
CREATE DATABASE note_database;
```
Above statement is for create the database
```
\c note_database
```
Above statement is for move into note database
```
CREATE TABLE note(
    note_id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    content varchar(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
Above statement is for create the table
- Install dependencies
```
npm install
```
- Install nodemon
```
npm install -g nodemon
```
- Run Server
```
npm run dev
```

# Techstack
- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv