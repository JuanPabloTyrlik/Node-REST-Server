const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/authorization');
let Producto = require('../model/producto');

// Obtener Productos

app.get('/producto', verifyToken, (req, res) => {
    let limite = Number(req.query.limite) || 10;
    let desde = Number(req.query.desde) || 0;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort()
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, cant) => {
                res.json({
                    ok: true,
                    total: cant,
                    productos
                });
            });
        });
});

// Obtener Producto por ID

// Crear Producto

app.post('/producto', verifyToken, (req, res) => {
    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    });
});

// Actualizar un producto

// Borrar un producto (Lógico -> disponible=false)

module.exports = {
    app
};