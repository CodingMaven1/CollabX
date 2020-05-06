const User = require('../models/user');
const validator = require('validator');
const ErrorMsg = require('../models/error');
const bcrypt = require("bcryptjs");


const createUser = async (req,res, next) => {
    const {name, email, password, confpassword} = req.body

    if(validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)){
        const error = new ErrorMsg('All fields are required', 400)
        return next(error)
    }
    else if(!validator.isEmail(email)){
        const error = new ErrorMsg('Please enter a valid email', 400)
        return next(error)
    }
    else if(password !== confpassword){
        const error = new ErrorMsg('The passwords do not match', 400)
        return next(error)
    }
    else if(validator.isLength(password, {min:8})){
        const error = new ErrorMsg('Password must be of 8 characters', 400)
        return next(error)
    }
    let user = new User(req.body)

    try{
        const token = await user.generateAuthToken();
        await user.save()
        res.status(201).send({user, token})
    } catch (error){
        res.status(400).send(error)
    }
}

const loginUser = async (req,res,next) => {
    try{
        let {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            const error = new ErrorMsg('Please Signup first!', 404)
            return next(error)
        }

        const match = await bcrypt.compare(password,user.password)
        if(!match){
            const error = new ErrorMsg('Invalid Credentials! Please try again', 400)
            return next(error)
        }

        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(error){
        res.status(400).send()
    }
}

const logoutUser = async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch(e){
        res.status(400).send("No User Found")
    }
}

const currentUser = async (req,res) => {
    res.send({user: req.user, token: req.token})
}

exports.createUser = createUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.currentUser = currentUser;