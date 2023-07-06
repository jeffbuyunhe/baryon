const userService = require('../services/userService')
const errors = require('../utils/errors')

/**
 * Gets all users
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await userService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Gets a single users with specified id
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getOne = async(req, res, next) => {
    try {
        res.json(await userService.getOne(req.params.id))
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates a user with specified information
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    try {
        const user = await userService.create(req.body, req.body.type)
        if(user == errors.PASSWORD_TOO_SMALL) throw Error(errors.PASSWORD_TOO_SMALL)
        else if (user == errors.REPEAT_EMAIL) throw Error(errors.REPEAT_EMAIL)
        else if (user == errors.CREATE) throw Error(errors.CREATE)
        else res.status(201).json(user)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Updates a user with specified information
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const update = async (req, res, next) => {
    try {
        const result = await userService.update(req.params.id, req.body, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        res.json(result)
    } catch (err) {
        throw Error(errors.UPDATE)
    }
}

/**
 * Deletes a user with specified information
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const remove = async (req, res, next) => {
    try {
        const result = await userService.destroy(req.params.id, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        res.status(204).json(result)
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

/**
 * Logs a user in and returns a jwt token as well as some basic user info
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const login = async(req, res, next) => {
    try {
        const credentials = await userService.login(req.body)
        if(credentials == errors.INVALID_CREDS) throw Error(errors.INVALID_CREDS)
        return res.status(200).json(credentials)
    } catch (err) {
        throw Error(errors.INVALID_CREDS)
    }
}

/**
 * Issues token for password reset
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const passwordReset = async(req, res, next) => {
    try {
        const token = await userService.passwordReset(req.body.email)
        if(token == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        res.status(200).json(token)
    } catch (err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Confirms password reset
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const passwordResetConfirm = async(req, res, next) => {
    try {
        const result = await userService.passwordResetConfirm(req.body.id, req.body.token, req.body.password)
        if(result == errors.PASSWORD_TOO_SMALL) throw Error(errors.PASSWORD_TOO_SMALL)
        if(result == errors.INVALID_TOKEN) throw Error(errors.INVALID_TOKEN)
        res.status(200).json({message: 'successful password change'})
    } catch (err) {
        throw Error(errors.INVALID_TOKEN)
    }
}

/**
 * Allows user to reset email
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const emailReset = async(req, res, next) => {
    try {
        const result = await userService.emailReset(req.params.id, req.body.email, req.user)
        if(result == errors.NOT_AUTHORIZED) throw Error(errors.NOT_AUTHORIZED)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Activates a user's account
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const activate = async(req, res, next) => {
    try {
        const result = await userService.activate(req.params.id, req.body.password, req.body.token)
        if(result == errors.INVALID_TOKEN) throw Error(errors.INVALID_TOKEN)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Checks if the account has been registered
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const isVerified = async(req, res, next) => {
    try {
        const result = await userService.isVerified(req.params.email)
        if(result == errors.USER_NOT_FOUND) throw Error(errors.USER_NOT_FOUND)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.USER_NOT_FOUND)
    }
}

/**
 * Returns the current logged in user
 *
 * @param {request object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const currentUser = async(req, res, next) => {
    try {
        res.status(200).json(await userService.currentUser(req.user.id))
    } catch (err) {
        throw Error(errors.SERVER_BREAK)
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    login,
    passwordReset,
    passwordResetConfirm,
    emailReset,
    activate,
    isVerified,
    currentUser
}