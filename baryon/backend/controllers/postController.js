const postService = require('../services/postService')
const errors = require('../utils/errors')
/**
 * Return all posts
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await postService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * return post with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await postService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}
/**
 * Creates a new post
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        let c = await postService.create(req.body)
        if(c==errors.CREATE) throw Error(c)
        else
        res.status(201).json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.CREATE)
    }
}
/**
 * Updates post with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const update = async (req, res, next) => {
    try {

        let c = await postService.update(req.params.id, req.body)
        if(c == errors.DUPLICATE_POST || c == errors.UPDATE )throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * adds comments to post with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const addComments = async (req, res, next) => {
    try {

        let c = await postService.addComments(req.params.id, req.body)
        if(c == errors.UPDATE )throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}

/**
 * deletes comments to post with specified id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const deleteComments = async (req, res, next) => {
    try {
        let c = await postService.deleteComments(req.params.id, req.body)
        if(c == errors.UPDATE )throw Error(c)
        res.json(c)
    } catch (err) {
        console.log(err)
        throw Error(errors.UPDATE)
    }
}
/**
 * Deletes a post with specified post id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        res.status(204).json(await postService.destroy(req.params.id))
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
    addComments,
    deleteComments
}