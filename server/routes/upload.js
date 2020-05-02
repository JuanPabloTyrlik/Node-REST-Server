const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { verifyToken } = require('../middlewares/authorization');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload', verifyToken, (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let tiposValidos = ['image/gif', 'image/jpeg', 'image/png'];

    if (tiposValidos.indexOf(archivo.mimetype) < 0) {
        let extension = archivo.name.split('.');
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo invalido',
                extension: extension[extension.length - 1]
            }
        });
    }

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${archivo.name}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            message: 'Archivo subido correctamente'
        });
    });
});

module.exports = {
    app
};