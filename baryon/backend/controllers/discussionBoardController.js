const discussionBoardService = require('../services/discussionBoardService')
const errors = require('../utils/errors')
/**
 * Return all forums
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await discussionBoardService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * return forum with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await discussionBoardService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * Creates a new forum
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        let c = await discussionBoardService.create(req.body)
        if(c == errors.COURSE_NOT_FOUND || c == errors.ORGANIZATION_INVALID || c == errors.DUPLICATE_FORUM || c==errors.CREATE) throw Error(c)
        else
        res.status(201).json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.CREATE)
    }
}
/**
 * Updates forum with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const update = async (req, res, next) => {
    try {

        let c = await discussionBoardService.update(req.params.id, req.body)
        if(c == errors.COURSE_NOT_FOUND||c==errors.DUPLICATE_FORUM||c==errors.ORGANIZATION_INVALID)throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * adds posts to forum with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const addPosts = async (req, res, next) => {
    try {

        let c = await discussionBoardService.addPosts(req.params.id, req.body)
        if(c == errors.UPDATE )throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * deletes posts from forum with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const deletePosts = async (req, res, next) => {
    try {

        let c = await discussionBoardService.deletePosts(req.params.id, req.body)
        if(c == errors.UPDATE )throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * Deletes a forum with specified fourm id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        res.status(204).json(await discussionBoardService.destroy(req.params.id))
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    addPosts,
    deletePosts
}