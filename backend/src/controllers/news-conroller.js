const needle = require('needle')
const ErrorMsg = require('../models/error');

const hackerNewsTopStories = async (req, res, next) => {
    const limit = req.query.limit
    const skip = req.query.skip
    try{
        let ids = await needle("get","https://hacker-news.firebaseio.com/v0/topstories.json")
        let arrayId = ids.body
        let news = []
        for(let j=skip; j < limit; j++){
            const url = "https://hacker-news.firebaseio.com/v0/item/" + arrayId[j] + ".json?print=pretty"
            try{
                let item = await needle("get",url)
                news.push(item.body)
            } catch(e){
                const error = new ErrorMsg("Couldn't load the given index")
                return next(error)
            }
        }
        res.send(news)
    } catch(e){
        const error = new ErrorMsg("Couldn't load the top stories", 500)
        return next(error)
    }
}

const hackerNewsNewStories = async (req, res, next) => {
    const limit = req.query.limit
    const skip = req.query.skip
    try{
        let ids = await needle("get","https://hacker-news.firebaseio.com/v0/newstories.json")
        let arrayId = ids.body
        let news = []
        for(let j=skip; j < limit; j++){
            const url = "https://hacker-news.firebaseio.com/v0/item/" + arrayId[j] + ".json?print=pretty"
            try{
                let item = await needle("get",url)
                news.push(item.body)
            } catch(e){
                const error = new ErrorMsg("Couldn't load the given index")
                return next(error)
            }
        }
        res.send(news)
    } catch(e){
        const error = new ErrorMsg("Couldn't load the new stories", 500)
        return next(error)
    }
}

exports.hackerNewsTopStories = hackerNewsTopStories;
exports.hackerNewsNewStories = hackerNewsNewStories;