const courseMaterialService = require('../services/courseMaterialService')
const errors = require('../utils/errors')
/**
 * Return all materials
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await courseMaterialService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * return all materials with specific id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        result = await courseMaterialService.getOne(req.params.id)
        if(result == null )throw Error(errors.GET)
        res.json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates all course material given course id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getByCourseId = async(req, res, next) => {
    try{
        const result = await courseMaterialService.getByCourseId(req.params.courseId)
        if(result == null )throw Error(errors.GET)
        res.json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a new material
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        result = await courseMaterialService.create(req.body)
        if(result==errors.CREATE)throw Error(errors.CREATE)
        res.status(201).json(result)
    } catch (err) {
        console.log(err)
        throw Error(errors.CREATE)
    }
}
/**
 * Updates material with specified id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const update = async (req, res, next) => {
    try {
        output = await courseMaterialService.update(req.params.id,req.body)
        if(output == errors.UPDATE) throw Error(errors.UPDATE)
        res.json(output)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * Deletes a material with specified id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        output = await courseMaterialService.destroy(req.params.id)
        if(output==errors.DESTROY){throw Error(errors.DESTROY)}
        res.status(204).json(output)
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    getByCourseId,
    remove
}