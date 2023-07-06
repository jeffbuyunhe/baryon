const commentService = require('../services/commentService')
const errors = require('../utils/errors')

/**
 * Gets all replies for a post
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getPostComments = async (req, res, next) => {
    try {
        res.json(await commentService.getPostComments(req.params.postid))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets a single comments with specified id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await commentService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a comment with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        const result = await commentService.create(req.body, req.params.postid, req.params.commentid, req.user)
        if(result == errors.GET) throw Error(errors.GET)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Updates a comment with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const update = async (req, res, next) => {
    try {
        const result = await commentService.update(req.body, req.params.id, req.params.postid, req.params.commentid, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        if(result == errors.GET) throw Error(errors.GET)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}


/**
 * Deletes an comment with specific id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        const result = await commentService.destroy(req.params.id, req.params.postid, req.user)
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
    getPostComments
}