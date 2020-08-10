const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    try {
        decodeToken = jwt.verify(token, 'jingzheng');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodeToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.id = decodeToken.id;
    next();
}