"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crudRouter = (0, express_1.Router)();
crudRouter.get('/get', (req, res) => {
    res.send('GET request to the homepage');
});
crudRouter.post('/post', (req, res) => {
    res.send('POST request to the homepage');
});
exports.default = crudRouter;
