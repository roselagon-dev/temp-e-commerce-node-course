const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true, 'Please provide name'],
        minlength:3,
        maxlength: 50
    },
    email:{
        type:String,
        require:[true, 'Please provide email'],
        validate: {
            message:'Please provide valid email',
            validator: validator.isEmail
        },
        unique: true
    },
    password:{
        type:String,
        require:[true, 'Please provide a password'],
        minlength:6
    },
    role:{
        type:String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

UserSchema.pre('save', async function(next){
    if (this.isModified('password')) { // only if password is modified if do a user.save
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})


UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)