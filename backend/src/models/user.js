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
    confpassword: {
        type: String,
        required: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    connections: [{
        connection: {
            type: mongoose.Schema.Types.ObjectId
        },
        collaborations: [{
            collabid: {
                type: mongoose.Schema.Types.ObjectId
            }
        }]
    }]
})

UserSchema.virtual('collabs', {
    ref: 'collab',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()

    delete userObject.password
    delete userObject.confpassword
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

UserSchema.pre('save', async function(next){
    const user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
        user.confpassword = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('Users', UserSchema)

module.exports = User