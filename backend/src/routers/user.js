const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/users', async (req,res) => {
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken();
        await user.save()
        res.status(201).send({user, token})
    } catch (error){
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.getCredentialByEmail(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e){
        res.status(400).send(e)
    }

})

router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch(e){
        res.status(400).send()
    }
})

router.get('/users/currentuser', auth, async (req,res) => {
    res.send({user: req.user, token: req.token})
})

module.exports = router