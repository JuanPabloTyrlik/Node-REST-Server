const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token inválido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verifyToken
};