const express = require('express');
const app = express();
const _ = require('underscore');

const { verifyToken, verifyAdminRole } = require('../middlewares/authorization');

let Categoria = require('../model/categoria');

app.get('/categoria', verifyToken, (req, res) => {
    let limite = Number(req.query.limite) || 5;
    let desde = Number(req.query.desde) || 0;

    Categoria.find({})
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, cant) => {
                res.json({
                    ok: true,
                    total: cant,
                    categorias
                });
            });
        });
});

app.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .exec((err, categoriaDB) => {
            if (err) return res.status(500).json({
                ok: false,
                err
            });
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                categoriaDB
            });
        });
});

app.post('/categoria', verifyToken, (req, res) => {
    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });
});

module.exports = {
    app
};