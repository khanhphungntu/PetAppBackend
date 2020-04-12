const jwt = require('jsonwebtoken');
const secret = require('./secret.json');

/**
 * middleware to check whether the token is valid
 */
const withAuth = function(req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['token'];
    if (!token) {
        console.log(token);
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret.key, function(err, decoded) {
        if (err) {
            res.status(401).send('Unauthorized: Invalid token');
        } else {
            req.id = decoded.id;
            next();
        }
        });
    }
}

module.exports = withAuth;