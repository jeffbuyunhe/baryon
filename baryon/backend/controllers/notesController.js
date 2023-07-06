const noteService = require('../services/noteService')
const errors = require('../utils/errors')

const getAll = async (req, res, next) => {
    try {
        res.json(await noteService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}

const getOne = async(req, res, next) => {
    try {
        res.json(await noteService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

const create = async (req, res, next) => {
    try {
        res.status(201).json(await noteService.create(req.body))
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

const update = async (req, res, next) => {
    try {
        res.json(await noteService.update(req.params.id, req.body))
    } catch (err) {
        throw Error(errors.UPDATE)
    }
}

const remove = async (req, res, next) => {
    try {
        res.status(204).json(await noteService.destroy(req.params.id))
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