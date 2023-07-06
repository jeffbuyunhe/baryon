const courseFileService = require('../services/courseFileService')
const errors = require('../utils/errors')

/**
 * It gets all the course files from the database.
 * @param req - The request object.
 * @param res - the response object
 * @param next - The next middleware function in the stack.
 */
const getAll = async (req, res, next) => {
    try {
        res.json(await courseFileService.getAll())
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * It gets one course file by id.
 * @param req - The request object.
 * @param res - the response object
 * @param next - The next middleware function in the stack.
 */
const getOne = async(req, res, next) => {
    try {
        result = await courseFileService.getOne(req.params.id)
        if(result==null)throw Error(errors.FILE_NOT_FOUND)
        else{
            res.json(result)
        }
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * It downloads a file from a database and sends it to the client.
 * @param req - request object
 * @param res - response object
 * @param next - The next middleware function in the stack.
 */
const download = async (req, res, next) => {
    try{
        downloadStream = await courseFileService.download(req.params.id)
        if(downloadStream==errors.FILE_NOT_FOUND) throw Error(errors.FILE_NOT_FOUND)
        res.status(200)
        res.set("Content-Disposition", "attachment");
        downloadStream.pipe(res)
    }catch(err){
        throw Error(errors.FILE_NOT_FOUND)
    }
}


/**
 * It uploads a file to the database.
 * @param req - the request object
 * @param res - the response object
 * @param next - is a function that is called when the middleware is done.
 */
const upload = async (req, res, next) => {
 try{
    if(!req.file){throw Error(errors.INVALID_REQUEST)}
    req.file.courseId = req.courseId
    req.file.uploaderId = req.uploaderId
    req.file._id = req.file.id
    res.status(201).json(await courseFileService.upload(req.file))
 }catch(err){
    throw Error(errors.INVALID_REQUEST)
 }
}


/**
 * It uploads multiple files to the database.
 * @param req - the request object
 * @param res - the response object
 * @param next - is a function that is called when the middleware is done.
 */
const uploadMany = async (req, res, next) => {
    try{
        if(!req.files){throw Error(errors.INVALID_REQUEST)}
        for(const file of req.files){
            file.courseId = req.courseId
            file.uploaderId = req.uploaderId
            file._id = file.id
        }
        res.status(201).json(await courseFileService.uploadMany(req.files))
     }catch(err){
        throw Error(errors.INVALID_REQUEST)
     }
}

/**
 * It's a function that deletes a file from a course.
 * @param req - request object
 * @param res - the response object
 * @param next - A function to be called if the middleware function does not end the request-response
 * cycle. If the current middleware function does not end the request-response cycle, it must call
 * next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
 */
const remove = async (req, res, next) => {
    try {
        output = await courseFileService.destroy(req.params.id)
        if(output==errors.DESTROY){throw Error(errors.DESTROY)}
        res.status(204).json(output)
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}

module.exports = {
    getAll,
    getOne,
    download,
    upload,
    uploadMany,
    remove
}