const Collab = require('../models/collab');
const validator = require('validator')
const ErrorMsg = require('../models/error');

const CreateCollab = async (req, res, next) => {
    let {name, description, language} = req.body
    if(name.length === 0 || description.length === 0){
        const error = new ErrorMsg("Please fill the required fields", 400)
        return next(error)
    }

    const createCollab = new Collab(req.body)
    try{
        await createCollab.save()
        res.status(201).send(createCollab)
    } catch(e){
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        res.send(error)
    }
}

exports.CreateCollab = CreateCollab