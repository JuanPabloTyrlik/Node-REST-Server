const express = require('express');
const app = express();
const { verifyToken, verifyAdminRole } = require('../middlewares/authorization');
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

app.get('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    });
});

// Busqueda de productos

app.get('/producto/buscar/:termino', verifyToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    let limite = Number(req.query.limite) || 10;
    let desde = Number(req.query.desde) || 0;

    Producto.find({ nombre: regex, disponible: true })
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
            Producto.countDocuments({ nombre: regex, disponible: true }, (err, cant) => {
                res.json({
                    ok: true,
                    total: cant,
                    productos
                });
            });
        });
});

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

app.put('/producto/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
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

// Borrar un producto (Lógico -> disponible=false)

app.delete('/producto/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    });
});

module.exports = {
    app
};