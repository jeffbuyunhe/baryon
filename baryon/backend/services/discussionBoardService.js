const Forum = require('../models/discussionBoard')
const Course = require('../models/course')
const Organization = require('../models/organization')
const errors = require('../utils/errors')
const course = require('../models/course')

const getAll = async () => {
    const forum = await Forum.find({})
    return forum
}

const getOne = async (id) => {
    const forum = await Forum.findById(id)
    return forum? forum : null
}

const update = async (id, inputs) => {
    let forum = await Forum.findById(id);
    if(!forum)return errors.FORUM_NOT_FOUND;
    let updates = {
        title:inputs.title,
        courseId:inputs.courseid,
        organizationId:inputs.organizationId
    }

    //check if course exists
    if(updates.courseId&&!(await Course.findById(inputs.courseid)))
    {
         return errors.COURSE_NOT_FOUND
    }

    //check if organization exists
    if(updates.organizationId&&!(await Organization.findById(inputs.organizationId)))
    {
         return errors.ORGANIZATION_INVALID
    }

    // check if forum with same name already exists
    if(updates.title&&(await Forum.findOne({title: updates.title, organizationId: forum.organizationId, courseId: forum.courseId }, {_id: 1})))
    {
         return errors.DUPLICATE_FORUM  
    }

    //no updates in request
    if(!updates.title && !updates.courseId && !updates.organizationId){
        return forum
    }

    try{
        const updatedForum = await Forum.findByIdAndUpdate(id,updates,{ new: true, runValidators: true })
        return updatedForum
    }catch(err){
        return errors.UPDATE
    }

}

const addPosts = async (id, inputs) => {
    if(!inputs.posts) return errors.UPDATE

    try{
        const newForum = await Forum.findByIdAndUpdate(id, {$addToSet: {posts: {$each: inputs.posts }}}, {new: true, runValidators: true})
        return newForum
    }catch(err){
        console.log(err)
        return errors.UPDATE
    }
}

const deletePosts = async (id, inputs) => {
    if(!inputs.postId) return errors.UPDATE

    try{
        const newForum = await Forum.findByIdAndUpdate(id, {$pull: {posts: inputs.postId}}, {new: true, runValidators: true})
        return newForum
    }catch(err){
        console.log(err)
        return errors.UPDATE
    }
}

const create = async (forum) => {
    //check for title

    if(!forum.title){
        return errors.CREATE
    }

    const forumTemplate = {
        courseId: forum.courseid,
        title: forum.title,
        organizationId: forum.organizationId
    }

    let newForum = new Forum({
        ...forumTemplate
    })

    const dupForum = await Forum.exists({title: forum.title, courseId: forum.courseid, organizationId: forum.organizationId})

    if(dupForum !== null){
        return errors.DUPLICATE_FORUM
    } 

    //organization not exists
    if(!(await Organization.findById(forum.organizationId))){
        return errors.ORGANIZATION_INVALID
    }
    //course not exists
    if(!(await Course.findById(forum.courseid))){
        return errors.COURSE_NOT_FOUND
    }

    newForum.save().then(savedForum => {
        return savedForum
    }).catch(err => {
        return errors.CREATE
    })

}

const destroy = async (id) => {

    Forum.findByIdAndRemove(id)
        .then(result => {
            return true
        }).catch(err => {
            errors.DESTROY
        })
}

module.exports = {
    getAll,
    getOne,
    update,
    destroy,
    create,
    addPosts,
    deletePosts
}   