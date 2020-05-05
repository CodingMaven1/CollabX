const User = require('../models/user');
const validator = require('validator');
const ErrorMsg = require('../models/error');

const createUser = async (req,res, next) => {
    const {name, email, password} = req.body

    if(validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)){
        const error = new ErrorMsg('All fields are required', 400)
        return next(error)
    }
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken();
        await user.save()
        res.status(201).send({user, token})
    } catch (error){
        res.status(400).send(error)
    }
}

const loginUser = async (req,res) => {
    try{
        const user = await User.getCredentialByEmail(req.body.email,req.body.password)
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