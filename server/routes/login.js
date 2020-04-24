const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../model/usuario');

app.post('/login', (req, res) => {
    Usuario.findOne({ email: req.body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if (bcrypt.compareSync(req.body.password, usuarioDB.password)) {
            return res.json({
                ok: true,
                usuarioDB,
                token: '123'
            });
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
    });
});

module.exports = {
    app
};