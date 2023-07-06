const Student = require('../models/student')
const User = require('../models/user')
const errors = require('../utils/errors')
const mongoose = require('mongoose')

// get all students
const getAll = async () => {
    const students = await Student.find({}).populate('_id')
    return students
}

// get single student with id
const getOne = async (id) => {
    const student = await Student.findById(id).populate('_id')
    return student? student : null
}

// get all students by organization id
const getAllByOrganizationId = async (orgId) => {
    const students = await User.aggregate().
        match({organizationId: mongoose.Types.ObjectId(orgId)}).
        lookup({ 
            from: 'students', 
            localField: "_id",
            foreignField: "_id",
            as: "student"
        }).
        unwind("student").
        project({
            firstname: 1,
            lastname: 1,
            email: 1,
            accountStatus: 1
        }).
        exec()
    return students
}

// create a student
const create = async (id, user) => {
    // make sure student does not already exist
    const existingstudent = await Student.findById(id)
    if (existingstudent) return errors.REPEAT_EMAIL

    const u = await User.findById(id)
    if(!user.isAdmin || !u.organizationId.equals(user.organizationId)) return errors.NOT_ADMIN

    const student = new Student({
        _id: id
    })

    const savedStudent = await student.save()
    return savedStudent.populate('_id')
}

// delete student with id
const destroy = async (id, reqUser) => {
    const u = Student.findById(id).populate('_id')
    // verify permissions
    if(id.equals(reqUser.id) || (reqUser.isAdmin && (reqUser.organizationId.equals(u._id.organizationId)))) await Student.findByIdAndRemove(id)
    else return errors.NOT_AUTHORIZED
    return true
}

// add course to student
const addCourse = async(id, course, user) => {
    const student = await Student.findById(id).populate('_id')
    if(!student) return errors.USER_NOT_FOUND
    // verify permissions
    if(!(user.isAdmin && user.organizationId.equals(student._id.organizationId))) return errors.NOT_ADMIN

    student.courses.append(course)
    await student.save()
    return student.populate('_id')
}

// remove course from student
const removeCourse = async(id, course, user) => {
    const student = await Student.findById(id)
    if(!student) return errors.USER_NOT_FOUND
    // verify permissions
    if(!(user.isAdmin && user.organizationId.equals(student._id.organizationId))) return errors.NOT_ADMIN

    student.courses = student.courses.filter(c => c != course)
    await student.save()
    return student.populate('_id')
}

// add ta course to student
const addTACourse = async(id, course, user) => {
    const student = await Student.findById(id).populate('_id')
    if(!student) return errors.USER_NOT_FOUND
    // verify permissions
    if(!(user.isAdmin && user.organizationId.equals(student._id.organizationId))) return errors.NOT_ADMIN

    student.taCourses.append(course)
    await student.save()
    return student.populate('_id')
}

// remove ta course from student
const removeTACourse = async(id, course, user) => {
    const student = await Student.findById(id)
    if(!student) return errors.USER_NOT_FOUND
    // verify permissions
    if(!(user.isAdmin && user.organizationId.equals(student._id.organizationId))) return errors.NOT_ADMIN

    student.taCourses = student.taCourses.filter(c => c != course)
    await student.save()
    return student.populate('_id')
}

module.exports = {
    getAll,
    getOne,
    getAllByOrganizationId,
    destroy,
    create,
    addCourse,
    addTACourse,
    removeCourse,
    removeTACourse
}