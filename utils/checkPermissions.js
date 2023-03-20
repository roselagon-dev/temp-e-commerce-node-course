const CustomError = require('../errors')

const checkPermissions = (requestUser, resourceUserId) => { // Self (ressourceID == requestUser.userId) or admin OK !
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);
    if (requestUser.role === 'admin') return;
    if (requestUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnauthorizedError(
        'Not authorized to access this route'
    )
}

module.exports = checkPermissions