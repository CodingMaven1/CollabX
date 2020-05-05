const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorMsg = require('../models/error');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Incorrect Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

UserSchema.methods.generateAuthToken = async function() {
    const user  = this
    const token = jwt.sign({ _id: user._id.toString()}, "themavenapi019")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.statics.getCredentialByEmail = async (email, password, next) => {
    const user = await User.findOne({ email })
    if(!user){
        let error = new ErrorMsg('No User Found!', 404)
        return next(error)
    }

    const match = await bcrypt.compare(password,user.password)
    if(!match){
        throw new Error("Invalid Credentials")
    }

    return user
}

UserSchema.pre('save', async function(next){
    const user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('Users', UserSchema)

module.exports = User