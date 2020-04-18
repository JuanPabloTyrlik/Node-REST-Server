const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Hello World');
});

app.get('/usuario', (req, res) => {
    res.json('GetUsuario()');
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    res.json({
        usuario: body,
        message: 'PostUsuario()'
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

app.listen(3000, () => {
    console.log('Escuchando puerto 3000');
});