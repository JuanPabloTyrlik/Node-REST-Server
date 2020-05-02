const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { verifyToken } = require('../middlewares/authorization');
const Usuario = require('../model/usuario');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', verifyToken, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    //Validaciones

    //Validar tipo
    let tiposValidos = ['producto', 'usuario'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo invalido',
            }
        });
    }

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

    let imgValidas = ['image/gif', 'image/jpeg', 'image/png'];

    let extension = archivo.name.split('.');
    extension = extension[extension.length - 1];
    if (imgValidas.indexOf(archivo.mimetype) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo de archivo invalido',
                extension
            }
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}s/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        imagenUsuario(id, res, nombreArchivo);

        // res.json({
        //     ok: true,
        //     message: 'Archivo subido correctamente',
        //     archivo: {
        //         nombre: nombreArchivo,
        //         extension
        //     }
        // });
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo('usuario', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo('usuario', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        borrarArchivo('usuario', usuarioDB.img);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuarioDB
            });
        });
    });
}

function imagenProduto() {

}

function borrarArchivo(tipo, nombreImg) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}s/${nombreImg}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = {
    app
};