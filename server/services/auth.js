const bcrypt = require('bcrypt');
var authService = {};

authService.comparePassword = (candidatePassword, password, next) => {    
    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
        if(err) return next(err);
        next(isMatch);
    })
}

authService.hashPassword = (password, next) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        next(hashedPassword);
    })
}

module.exports = authService;