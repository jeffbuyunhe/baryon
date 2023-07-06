const answerService = require('../services/answerService')
const errors = require('../utils/errors')

/**
 * Gets all answers for a course
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getPostAnswer = async (req, res, next) => {
    try {
        res.json(await answerService.getPostAnswers(req.params.postid))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets a single answers with specified id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await answerService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a answer with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        const result = await answerService.create(req.body, req.params.postid, req.params.courseid, req.user)
        if(result == errors.GET) throw Error(errors.GET)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Updates a answer with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const update = async (req, res, next) => {
    try {
        const result = await answerService.update(req.body, req.params.id, req.params.postid, req.params.courseid, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        if(result == errors.GET) throw Error(errors.GET)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}


/**
 * Deletes an answer with specific id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        const result = await answerService.destroy(req.params.id, req.params.postid, req.params.cid, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        if(result == errors.GET) throw Error(errors.GET)
        res.status(204).json(result)
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

module.exports = {
    getOne,
    create,
    remove,
    update,
    getPostAnswer
}