const courseService = require('../services/courseService')
const errors = require('../utils/errors')
/**
 * Return all courses
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await courseService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * return all course with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await courseService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * Gets all courses by organization id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAllByOrgId = async(req, res, next) => {
    try {
        res.json(await courseService.getAllByOrganizationId(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * Creates a new course
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        let c = await courseService.create(req.body)
        if(c == errors.DUPLICATE_COURSE || c == errors.ORGANIZATION_INVALID) throw Error(c)
        else
        res.status(201).json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.CREATE)
    }
}
/**
 * Updates couse with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const update = async (req, res, next) => {
    try {
        let c = await courseService.update(req.params.id, req.body)
        if(c == errors.COURSE_NOT_FOUND||c==errors.DUPLICATE_COURSE||c==errors.ORGANIZATION_INVALID)throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * Updates couse with specified id by adding label
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const addLabel = async (req, res, next) => {
    try {
        let c = await courseService.addLabel(req.params.id, req.body)
        if(c == errors.COURSE_NOT_FOUND||c==errors.DUPLICATE_COURSE||c==errors.ORGANIZATION_INVALID)throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * Adds relationship between  course with specified id to a list of TAs,Students, and Instructors ids
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const addUsers = async (req, res, next) => {
    try {
        let c = await courseService.update(req.params.id, req.body)
        if(c == errors.COURSE_NOT_FOUND)throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}
/**
 * Deletes relationship between course with specified id and list of TAs, Students,and Instructors ids
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const removeUsers = async (req, res, next) => {
    try {
        let c = await courseService.update(req.params.id, req.body)
        if(c == errors.COURSE_NOT_FOUND)throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}
/**
 * Deletes a course with specified course id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        res.status(204).json(await courseService.destroy(req.params.id))
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

module.exports = {
    getAll,
    getOne,
    getAllByOrgId,
    create,
    update,
    remove,
    removeUsers,
    addLabel,
    addUsers,
}