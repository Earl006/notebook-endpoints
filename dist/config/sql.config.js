"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const sql = require('mssql');
require('dotenv').config();
exports.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
sql.connect(exports.config)
    .then(() => {
    console.log('Connected to SQL Server');
})
    .catch((err) => {
    console.error('Error connecting to SQL Server', err);
});
