const bcrypt = require('bcrypt');
var authService = {};

/**
 * Check if the given password is correct
 */
authService.comparePassword = (candidatePassword, password, next) => {   
    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
        if(err)
         return next(err);
        next(isMatch);
    })
}

/**
 * Hash the given password
 */
authService.hashPassword = (password, next) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        next(hashedPassword);
    })
}

module.exports = authService;