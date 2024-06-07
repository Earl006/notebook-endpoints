"use strict";
const sql = require('mssql');
require('dotenv').config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
sql.connect(config)
    .then(() => {
    console.log('Connected to SQL Server');
})
    .catch((err) => {
    console.error('Error connecting to SQL Server', err);
});
