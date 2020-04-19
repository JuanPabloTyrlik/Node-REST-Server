const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const Usuario = require('../model/usuario');

app.get('/usuario', (req, res) => {
    res.json('GetUsuario()');
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

    res.json({
        id,
        message: 'PutUsuario()'
    });
});

app.delete('/usuario', (req, res) => {
    res.json('DeleteUsuario()');
});

module.exports = {
    app
};