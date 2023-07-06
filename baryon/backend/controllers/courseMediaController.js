const courseMediaService = require('../services/courseMediaService')
const errors = require('../utils/errors')
/**
 * Return all media
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await courseMediaService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * return all media with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        result = await courseMediaService.getOne(req.params.id)
        if(result == null )throw Error(errors.GET)
        res.json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a new media
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        result = await courseMediaService.create(req.body)
        if(result==errors.CREATE)throw Error(errors.CREATE)
        res.status(201).json(result)
    } catch (err) {
        console.log(err)
        throw Error(errors.CREATE)
    }
}
/**
 * Updates media with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const update = async (req, res, next) => {
    try {
        output = await courseMediaService.update(req.params.id,req.body)
        if(output == errors.UPDATE) throw Error(errors.UPDATE)
        res.json(output)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * Deletes a media with specified  id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        output = await courseMediaService.destroy(req.params.id)
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
    remove
}