const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET, { algorithms: ['HS256'] });
    return verifyToken;
}

const verifyAccesApi = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const tokenPayload = verifyToken(token)
        req.user = tokenPayload;
        next()
    } catch (error) {
        res.status(403).json({
            error: 'No tienes permisos'
        })
    }
}

module.exports = verifyAccesApi;