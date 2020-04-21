const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../model/usuario');


app.get('/usuario', (req, res) => {

    let limite = Number(req.query.limite) || 5;
    let desde = Number(req.query.desde) || 0;

    Usuario.find({ estado: true }, 'nombre email img role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, cant) => {
                res.json({
                    ok: true,
                    total: cant,
                    usuarios
                });
            });
        });
});

app.post('/usuario', (req, res) => {

    let usuario = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;
    // BORRADO FISICO

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { ... }

    // BORRADO LOGICO 

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDeshabilitado) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        if (!usuarioDeshabilitado) return res.status(400).json({
            ok: false,
            err: {
                message: 'Usuario no encontrado'
            }
        });
        res.json({
            ok: true,
            usuario: usuarioDeshabilitado
        });
    });
});

module.exports = {
    app
};