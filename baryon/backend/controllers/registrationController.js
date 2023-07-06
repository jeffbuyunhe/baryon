const registrationService = require('../services/registrationService')
const errors = require('../utils/errors')

const registerStudents = async (req, res, next) => {
    try {
        if(!req.user.organizationId) throw Error(errors.CSV_ERROR)
        res.status(201).json(await registrationService.registerStudents(req.file, req.user))
    } catch (err) {
        throw Error(errors.CSV_ERROR)
    }
}

const registerInstructors = async (req, res, next) => {
    try {
        if(!req.user.organizationId) throw Error(errors.CSV_ERROR)
        res.status(201).json(await registrationService.registerInstructors(req.file, req.user))
    } catch (err) {
        throw Error(errors.CSV_ERROR)
    }
}

const registerCourses = async (req, res, next) => {
    try {
        if(!req.user.organizationId) throw Error(errors.CSV_ERROR)
        res.status(201).json(await registrationService.registerCourses(req.file, req.user))
    } catch (err) {
        throw Error(errors.CSV_ERROR)
    }
}

const registerStudentsToCourse = async (req, res, next) => {
    try {
        if(!req.user.organizationId) throw Error(errors.CSV_ERROR)
        res.status(200).json(await registrationService.registerStudentsToCourse(req.file, req.params.id))
    } catch (err) {
        throw Error(errors.CSV_ERROR)
    }
}

const registerInstructorsToCourse = async (req, res, next) => {
    try {
        if(!req.user.organizationId) throw Error(errors.CSV_ERROR)
        res.status(200).json(await registrationService.registerInstructorsToCourse(req.file, req.params.id))
    } catch (err) {
        throw Error(errors.CSV_ERROR)
    }
}

module.exports = {
    registerStudents,
    registerInstructors,
    registerCourses,
    registerStudentsToCourse,
    registerInstructorsToCourse
}