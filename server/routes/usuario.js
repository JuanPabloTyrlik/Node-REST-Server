const express = require('express');
const app = express();

app.get('/usuario', (req, res) => {
    res.json('GetUsuario()');
});

app.post('/usuario', (req, res) => {

    if (req.body === undefined) {
        res.status(400).json({
            ok: false,
            message: 'Debe proveer el nombre'
        });
    } else {
        res.json({
            usuario: req.body,
            message: 'PostUsuario()'
        });
    }

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