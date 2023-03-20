const CustomError = require('../errors')
const {isTokenValid} = require('../utils')

const authenticateUser = async(req, res, next) => {
    const token = req.signedCookies.token

    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }

    try {
        const {name, userId, role} = isTokenValid({token})
        req.user = {name, userId, role} // params available on all pages where the middleware is loaded
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    
}

const authorizePermissions = (...roles) => { // ...roles transform all entries to an array (rest writing)
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized access to this route')
        }
        next();
    }
}

module.exports = {authenticateUser, authorizePermissions}