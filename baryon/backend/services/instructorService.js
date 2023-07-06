const Instructor = require('../models/instructor')
const User = require('../models/user')
const errors = require('../utils/errors')
const mongoose = require('mongoose')

// gets all instructors
const getAll = async () => {
    const instructors = await Instructor.find({}).populate('_id')
    return instructors
}

// gets single instructor with id
const getOne = async (id) => {
    const instructor = await Instructor.findById(id).populate('_id')
    return instructor? instructor : null
}

// get all instructors by organization id
const getAllByOrganizationId = async (orgId) => {
    const instructors = await User.aggregate().
        match({organizationId: mongoose.Types.ObjectId(orgId)}).
        lookup({ 
            from: 'instructors', 
            localField: "_id",
            foreignField: "_id",
            as: "instructor"
        }).
        unwind("instructor").
        project({
            firstname: 1,
            lastname: 1,
            email: 1,
            accountStatus: 1
        }).
        exec()
    return instructors
}

// creates instructor
const create = async (id, user) => {
    // make sure instructor is not already declared
    const existinginstructor = await Instructor.findById(id)
    if (existinginstructor) return errors.REPEAT_EMAIL

    const u = await User.findById(id)
    if(!user.isAdmin || !u.organizationId.equals(user.organizationId)) return errors.NOT_ADMIN

    const instructor = new Instructor({
        _id: id
    })

    const savedinstructor = await instructor.save()
    return savedinstructor.populate('_id')
}

// deletes a instructor
const destroy = async (id, reqUser) => {
    const u = Instructor.findById(id).populate('_id')
    // verify permissions
    if(id.equals(reqUser.id) || (reqUser.isAdmin && (reqUser.organizationId.equals(u._id.organizationId))))
        await Instructor.findByIdAndRemove(id)
    else return errors.NOT_AUTHORIZED
    return true
}

// adds course to instructor
const addCourse = async(id, course, user) => {
    const instructor = await Instructor.findById(id).populate('_id')
    if(!instructor) return errors.USER_NOT_FOUND
    // verify permissions
    if(!(user.isAdmin && user.organizationId.equals(instructor._id.organizationId))) return errors.NOT_ADMIN

    instructor.courses.append(course)
    await instructor.save()
    return instructor.populate('_id')
}

// deletes course from instructor
const removeCourse = async(id, course, user) => {
    const instructor = await Instructor.findById(id)
    if(!instructor) return errors.USER_NOT_FOUND
    // verify permissions
    if(!(user.isAdmin && user.organizationId.equals(instructor._id.organizationId))) return errors.NOT_ADMIN

    instructor.courses = instructor.courses.filter(c => c != course)
    await instructor.save()
    return instructor.populate('_id')
}

module.exports = {
    getAll,
    getOne,
    getAllByOrganizationId,
    destroy,
    create,
    addCourse,
    removeCourse
}