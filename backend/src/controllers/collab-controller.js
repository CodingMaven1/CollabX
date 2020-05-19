const Collab = require('../models/collab');
const validator = require('validator')
const ErrorMsg = require('../models/error');

const CreateCollab = async (req, res, next) => {
    let {name, description, language} = req.body
    if(name.length === 0 || description.length === 0){
        const error = new ErrorMsg("Please fill the required fields", 400)
        return next(error)
    }

    const createCollab = new Collab({
        ...req.body,
        owner: req.user._id
    })
    try{
        await createCollab.save()
        res.status(201).send(createCollab)
    } catch(e){
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        return next(error)
    }
}

const GetAllCollab = async (req, res, next) => {
    try{
        const collabs = await Collab.find()
        if(collabs.length === 0){
            const error = new ErrorMsg("No collaboration requests have been created yet!", 400)
            return next(error)
        }
        res.send(collabs)
    } catch(e){
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        return next(error)
    }
}

const GetUserCollab = async (req, res, next) => {
    try{
        await req.user.populate({
            path: 'collabs'
        }).execPopulate()
        if(req.user.collabs.length === 0){
            const error = new ErrorMsg("You haven't created any collaboration request!", 400)
            return next(error)
        }
        res.send(req.user.collabs)
    } catch(e){
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        return next(error)
    }
}

const UpdateUserCollab = async (req,res, next) => {
    const updatationKeys = Object.keys(req.body)
    const allowed = ["name","description","language"]
    const valid = updatationKeys.every((key) => {
        return allowed.includes(key)
    })

    if(!valid){
        const error = new ErrorMsg('Please fill the required fields!',400)
        return next(error)
    }

    try{
        const collab = await Collab.findOne({_id: req.params.id, owner: req.user._id})
        if(!collab){
            const error = new ErrorMsg('No such collab request exists to update!',400)
            return next(error)
        }
        updatationKeys.forEach((key) => {
            collab[key] = req.body[key]
        })

        await collab.save()

        res.send(collab)
    } catch(e){
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        return next(error)
    }
}

const DeletUserCollab = async (req,res,next) => {
    try{
        const collab = await Collab.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!collab){
            const error = new ErrorMsg('No such collab request exists to delete!',400)
            return next(error)
        } 
        res.send(collab)
    } catch(e){
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        return next(error)
    }
}

exports.CreateCollab = CreateCollab
exports.GetAllCollab = GetAllCollab
exports.GetUserCollab = GetUserCollab
exports.DeletUserCollab = DeletUserCollab
exports.UpdateUserCollab = UpdateUserCollab