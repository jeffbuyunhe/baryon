const Forum = require('../models/discussionBoard')
const Course = require('../models/course')
const Organization = require('../models/organization')
const errors = require('../utils/errors')
const course = require('../models/course')
const { validate } = require('../models/user')
const post = require('../models/post')
const { findById } = require('../models/discussionBoard')

const getAll = async () => {
    const foundPost = await post.find({})
    return foundPost
}

const getOne = async (id) => {
    const foundPost = await post.findById(id)
    return foundPost? foundPost : null
}

const update = async (id, inputs) => {
    updates = {
        title: inputs.title,
        content: inputs.content,
        likes: inputs.likes,
    }
    if(!updates.title && !updates.content && !updates.likes && !updates.comments){
        const postResult = await post.findById(id)
        return postResult
    }

    try{
        const updatedPost = await post.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        return updatedPost
    }catch(err){
        return errors.UPDATE
    }

}

const addComments = async (id, inputs) => {
    
    if(!inputs.comments) return errors.UPDATE

    try{
        const newPost = await post.findByIdAndUpdate(id, {$addToSet: {comments: {$each: inputs.comments }}}, {new: true, runValidators: true})
        return newPost
    }catch(err){
        console.log(err)
        return errors.UPDATE
    }

}

const deleteComments = async (id, inputs) => {

    if(!inputs.comments) return errors.UPDATE

    try{
        const newPost = await post.findByIdAndUpdate(id, {$pull: {comments: inputs.comments}}, {new: true, runValidators: true})
        return newPost
    }catch(err){
        return errors.UPDATE
    }
}

const create = async (postInfo) => {

    if(!postInfo.title || !postInfo.author || !postInfo.content) return errors.CREATE

    let createInfo = {
        title: postInfo.title,
        author: postInfo.author,
        content: postInfo.content
    }

    let newPost = new post({
        ...createInfo
    })

    newPost.save().then(savedPost => {
        return savedPost
    }).catch((err) => {
        return errors.UPDATE
    })

}

const destroy = async (id) => {

    post.findByIdAndRemove(id).then(result => {
        return true
    }).catch(err => {
        return errors.DESTROY
    })
}

module.exports = {
    getAll,
    getOne,
    update,
    destroy,
    create,
    addComments,
    deleteComments
}   