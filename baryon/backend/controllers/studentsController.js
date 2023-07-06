const studentService = require('../services/studentService')
const errors = require('../utils/errors')

/**
 * Gets all students
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await studentService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets a single students with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await studentService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets all students by organization id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAllByOrgId = async(req, res, next) => {
    try {
        res.json(await studentService.getAllByOrganizationId(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a student with specified id (relating to a user)
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        const result = await studentService.create(req.body.id, req.user)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Deletes an student with specific id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        const result = await studentService.destroy(req.params.id, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        res.status(204).json(result)
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

/**
 * Adds course to an student with specified id, takes course id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const addCourse = async (req, res, next) => {
    try {
        const result = await studentService.addCourse(req.params.id, req.body.course, req.user)
        if(result == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(200).json(result)
    } catch(err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Deletes course to an student with specified id, takes course id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const removeCourse = async (req, res, next) => {
    try {
        const result = await studentService.removeCourse(req.params.id, req.body.course, req.user)
        if(result == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(200).json(result)
    } catch(err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Adds course to an student ta list with specified id, takes course id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const addTACourse = async (req, res, next) => {
    try {
        const result = await studentService.addTACourse(req.params.id, req.body.course, req.user)
        if(result == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(200).json(result)
    } catch(err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Deletes course to an student ta list with specified id, takes course id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const removeTACourse = async (req, res, next) => {
    try {
        const result = await studentService.removeTACourse(req.params.id, req.body.course, req.user)
        if(result == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(200).json(result)
    } catch(err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

module.exports = {
    getAll,
    getOne,
    getAllByOrgId,
    create,
    remove,
    addCourse,
    removeCourse,
    addTACourse,
    removeTACourse
}