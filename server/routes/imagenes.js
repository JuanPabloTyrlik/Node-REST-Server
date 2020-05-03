const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verifyTokenUrl } = require('../middlewares/authorization');

app.get('/imagen/:tipo/:img', verifyTokenUrl, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}s/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImg);
    }
});

module.exports = {
    app
};