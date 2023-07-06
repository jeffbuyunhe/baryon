const assignmentService = require('../services/assignmentService.js')
const errors = require('../utils/errors')


/**
 * Return all assignment for a specific course
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getCourseAll = async (req, res, next) => {

    const courseId = req.params.courseid
    if(!courseId){
        throw Error(errors.GET)
    }
    try {
        const result = await assignmentService.getCourseAll(courseId)
        if (result == errors.GET)
            throw Error(errors.GET)
    else   
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}

/**
 * Creates an assignment for all student in the specific course
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const create = async (req, res, next) => {
    const {courseId,courseFileId, title,dueDate,weight, totalMark} = req.body
    if(!courseId || !title || !dueDate ||!weight || !totalMark){
        throw Error(errors.CREATE)
    }
    try {
        const result = await assignmentService.create(courseId,courseFileId, title,dueDate,weight, totalMark)
        
        if (result == errors.CREATE)
            throw Error(errors.CREATE)
        else   
            res.status(201).json(result)
        
    } catch (err) {
        throw Error(errors.CREATE)
    }
}
/**
 * Get a specific student's all assignment
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getStudentAll = async (req, res, next) => {
    const studentId = req.params.studentid
    if(!studentId){
        throw Error(errors.GET)
    }
    try {
        const result = await assignmentService.getStudentAll(studentId)
        if (result == errors.GET)
            throw Error(errors.GET)
        else   
            res.status(200).json(result)
    } catch (err) {
        throw Error(errors.UPDATE)
    }
}



/**
 * Get all assignment of a student in specific course
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getStudentInCourse = async (req, res, next) => {
    const studentId = req.params.studentid
    const courseId = req.params.courseid
    if(!studentId || !courseId){
        throw Error(errors.GET)
    }
    try {
        const result = await assignmentService.getStudentInCourse(studentId, courseId)
        if (result == errors.GET)
            throw Error(errors.GET)
        else   
            res.status(200).json(result)
    } catch (err) {
        throw Error(errors.UPDATE)
    }
}


/**
 * Detele a specific assignment in the course
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */

const deleteAssignment = async(req, res, next) =>{
    const assignId = req.body.assignmentId
    if(!assignId){
        throw Error(errors.DESTROY)
    }
    try {
        const result = await assignmentService.deleteAssignment(assignId)
        if (result == errors.DESTROY)
            throw Error(errors.DESTROY)
        else  
            res.status(201).json(result)
    } catch (err) {
        throw Error(errors.DESTROY)
    }
}
/**
 * Update a specific assignment in the course
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */

 const updateAssignment = async(req, res, next) =>{
    const {assignmentId,title,dueDate,weight, totalMark} = req.body
    
    if(!(assignmentId && (title || dueDate || weight || totalMark))){
        throw Error(errors.UPDATE)
    }
    try {
        const result = await assignmentService.updateAssignment(assignmentId, title,dueDate,weight, totalMark)
        if (result == errors.UPDATE)
            throw Error(errors.UPDATE)
        else  
            res.status(201).json(result)
    } catch (err) {
        throw Error(errors.UPDATE)
    }

}



module.exports = {
    getCourseAll,
    create,
    getStudentAll,
    getStudentInCourse,
    deleteAssignment,
    updateAssignment
}