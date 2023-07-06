const organizationService = require('../services/organizationService')
const errors = require('../utils/errors')

/**
 * Gets all organizations
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await organizationService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets an organization with specific id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await organizationService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets an organization with specific name
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOneByName = async(req, res, next) => {
    try {
        res.json(await organizationService.getOneByName(req.params.name))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Create an organization
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        res.status(201).json(await organizationService.create(req.body, req.user))
    } catch (err) {
        throw Error(errors.CREATE)
    }
}


/**
 * Updates organization with specified ID
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const update = async (req, res, next) => {
    try {
        res.json(await organizationService.update(req.params.id, req.body))
    } catch (err) {
        throw Error(errors.UPDATE)
    }
}

/**
 * Deletes organization with specified ID
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        res.status(204).json(await organizationService.destroy(req.params.id))
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

module.exports = {
    getAll,
    getOne,
    getOneByName,
    create,
    update,
    remove
}