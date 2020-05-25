const Collab = require('../models/collab');
const User = require('../models/user')
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

const RequestCollaboration = async (req,res,next) => {
    const id = req.params.id
    const userid = req.user._id
    try{
        const collab = await Collab.findOne({_id: id})
        if(!collab){
            const error = new ErrorMsg('No such collab request exists!',400)
            return next(error)
        }
        collab.collaborators.push({collaborator: userid, status: null})
        await collab.save()

        res.send(collab)
    } catch(e) {
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        return next(error)
    }
}

const ConfirmCollaboration = async (req,res,next) => {
    const id = req.params.id
    const {status, userid} = req.body
    try{
        let collab = await Collab.findOne({_id: id})
        if(!collab){
            const error = new ErrorMsg('No such collab request exists!',400)
            return next(error)
        }
        if(!req.user._id.equals(collab.owner)){
            const error = new ErrorMsg('You are not authorized!',400)
            return next(error)
        }
        let collabindex = null;
        let collaborators = collab.collaborators
        for(let i=0; i<collaborators.length; i++){
            if(collaborators[i].collaborator.equals(userid)){
                collabindex = i
            }
        }
        if(collabindex == null){
            const error = new ErrorMsg('No such collborator exists!',400)
            return next(error)
        }
        console.log(collabindex, collaborators)
        if(status == "No"){
            collab.collaborators[collabindex].status = "No"
            await collab.save()
            res.send(collab)
        }
        else{
            let user = await User.findOne({_id: userid})
            let connections = user.connections;
            let useridx = null;
            console.log(connections.length)
            for(let j=0; j < connections.length; j++){
                if(connections[j].connection.equals(req.user._id)){
                    console.log(connections[j].connection.equals(req.user_id))
                    useridx = j
                }
            }
            console.log(useridx)
            if(useridx != null){
                user.connections[useridx].collaborations.push({collabid: id})
            }
            else{
                user.connections.push({connection: req.user._id})
                let index = user.connections.length
                user.connections[index-1].collaborations.push({collabid: id})
            }
            collab.collaborators[collabindex].status = "Yes"
            await collab.save()
            await user.save()

            res.send({user, collab})
        }

    } catch(e) {
        const error = new ErrorMsg("Oops! Something went wrong. Try again", 500)
        return next(error)
    }
}

exports.CreateCollab = CreateCollab
exports.GetAllCollab = GetAllCollab
exports.GetUserCollab = GetUserCollab
exports.DeletUserCollab = DeletUserCollab
exports.UpdateUserCollab = UpdateUserCollab
exports.RequestCollaboration = RequestCollaboration
exports.ConfirmCollaboration = ConfirmCollaboration