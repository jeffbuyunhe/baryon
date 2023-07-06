const announcementService = require('../services/announcementService')
const errors = require('../utils/errors')

/**
 * Gets all announcements for a course
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getCourseAnnouncement = async (req, res, next) => {
    try {
        res.json(await announcementService.getCourseAnnouncement(req.params.courseid))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets a single announcements with specified id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await announcementService.getOne(req.params.id, req.user))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets all announcements for a student
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getForStudent = async(req, res, next) => {
    try {
        const result = await announcementService.getForStudent(req.user.id)
        if(result == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        res.json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a announcement with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        const result = await announcementService.create(req.body, req.params.courseid, req.user)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Updates a announcement with specified id (relating to a user)
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const update = async (req, res, next) => {
    try {
        const result = await announcementService.update(req.body, req.params.courseid, req.params.id, req.user)
        if(result == errors.NOT_ADMIN) throw Error(errors.NOT_ADMIN)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}


/**
 * Deletes an announcement with specific id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        const result = await announcementService.destroy(req.params.id)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
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
    getCourseAnnouncement,
    getForStudent
}