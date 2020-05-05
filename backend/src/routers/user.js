const express = require('express');
const userController = require('../controllers/user-controller');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/signup', userController.createUser)

router.post('/login', userController.loginUser)

router.post('/logout', auth, userController.logoutUser)

router.get('/currentuser', auth, userController.currentUser)

module.exports = router