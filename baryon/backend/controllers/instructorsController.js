const instructorService = require('../services/instructorService')
const errors = require('../utils/errors')

/**
 * Gets all instructors
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await instructorService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets a single instructors with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await instructorService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a instructor with specified id (relating to a user)
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        const result = await instructorService.create(req.body.id, req.user)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Gets all instructors by organization id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAllByOrgId = async(req, res, next) => {
    try {
        res.json(await instructorService.getAllByOrganizationId(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Deletes an instructor with specific id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        const result = await instructorService.destroy(req.params.id, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        res.status(204).json(result)
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

/**
 * Adds course to an instructor with specified id, takes course id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const addCourse = async (req, res, next) => {
    try {
        const result = await instructorService.addCourse(req.params.id, req.body.course, req.user)
        if(result == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(200).json(result)
    } catch(err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Deletes course to an instructor with specified id, takes course id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const removeCourse = async (req, res, next) => {
    try {
        const result = await instructorService.removeCourse(req.params.id, req.body.course, req.user)
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
    removeCourse
}