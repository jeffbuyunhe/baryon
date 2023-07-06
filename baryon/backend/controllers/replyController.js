const replyService = require('../services/replyService')
const errors = require('../utils/errors')

/**
 * Gets all replies for a post
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getCommentReplies = async (req, res, next) => {
    try {
        res.json(await replyService.getCommentReplies(req.params.commentid))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets a single replys with specified id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await replyService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a reply with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        const result = await replyService.create(req.body, req.params.commentid, req.params.courseid, req.user)
        if(result == errors.GET) throw Error(errors.GET)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Updates a reply with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const update = async (req, res, next) => {
    try {
        const result = await replyService.update(req.body, req.params.id, req.params.commentid, req.params.courseid, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        if(result == errors.GET) throw Error(errors.GET)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}


/**
 * Deletes an reply with specific id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        const result = await replyService.destroy(req.params.id, req.params.commentid, req.user)
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
    getCommentReplies
}