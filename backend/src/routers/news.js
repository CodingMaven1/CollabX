const express = require('express');
const router = new express.Router();
const newsController = require('../controllers/news-conroller')

router.get('/hackernews/top', newsController.hackerNewsTopStories)

router.get('/hackernews/new', newsController.hackerNewsNewStories)

module.exports = router