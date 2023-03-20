const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse,createTokenUser,checkPermissions} = require('../utils')

const getAllUsers = async(req, res) => {
    console.log(req.user)
    const users = await User.find({role:'user'}).select('-password').sort('createdAt')
    res.status(StatusCodes.OK).json({users, count:users.length})
}
const getSingleUser = async(req, res) => {
    const user = await User.findOne({
        _id:req.params.id
    }).select('-password')
    if (!user){
        throw new CustomError.NotFoundError(`no user with id : ${req.params.id}`)
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser = async(req, res) => {
    res.status(StatusCodes.OK).json({user:req.user})
}
// update user with findByIdAndUpdate
// const updateUser = async(req, res) => {
//     const {email, name} = req.body
//     if(!email || !name) {
//         throw new CustomError.BadRequestError('Please provide mail and name value')
//     }
//     const user = await User.findByIdAndUpdate({_id:req.user.userId}, {email, name}, {new:true, runValidators:true})
//     const tokenUser = createTokenUser(user)
//     attachCookiesToResponse({res, user:tokenUser})
//     res.status(StatusCodes.OK).json({user:tokenUser})
// }

//update user with user.save -> reexcute password pre function and destroy it
const updateUser = async(req, res) => {
    const {email, name} = req.body
    if(!email || !name) {
        throw new CustomError.BadRequestError('Please provide mail and name value')
    }
    const user = await User.findOne({_id: req.user.userId});
    user.email = email;
    user.name = name;
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

const updateUserPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both passwords')
    }
    const user = await User.findOne({_id:req.user.userId})
    // compare password
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg:"Success ! Password updated"})
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}