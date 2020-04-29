const express = require('express');
const app = express();

const { verifyToken } = require('../middlewares/authorization');

let Categoria = require('../model/categoria');

app.get('/categoria', verifyToken, (req, res) => {
    let limite = Number(req.query.limite) || 5;
    let desde = Number(req.query.desde) || 0;

    Categoria.find({})
        .skip(desde)
        .limit(limite)
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
            res.json({
                ok: true,
                categoriaDB
            });
        });
});

module.exports = {
    app
};