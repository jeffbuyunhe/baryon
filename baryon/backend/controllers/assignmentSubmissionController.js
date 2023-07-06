const assignmentSubmissionService = require('../services/assignmentSubmissionService')
const errors = require('../utils/errors')
/**
 * Return all assignmentSubmission
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getAllAssignmentSubmission = async (req, res, next) => {
    try {
        const result = await assignmentSubmissionService.getAllAssignmentSubmission()
        if(result == errors.GET)
            throw Error(errors.GET)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}


/**
 * Return specific assignmentSubmission by its assignmentId and studentId
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const getSpecificAssignmentSubmission = async (req, res, next) => {
    const assignmentId = req.params.assignmentid
    const studentId = req.params.studentid

    if(!assignmentId || !studentId)
        throw Error(errors.GET)
    try {
        const result = await assignmentSubmissionService.getSpecificAssignmentSubmission(assignmentId,studentId)
        if(result == errors.GET)
            throw Error(errors.GET)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}



/**
 * grade a specific assignment Submission given student id and assignment id
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const gradeAssignmentSubmission = async (req, res, next) => {
    const {assignmentId,studentId,markObtained,feedback} = req.body
    if(!assignmentId || !studentId || !markObtained)
        throw Error(errors.UPDATE)
    try {
        const result = await assignmentSubmissionService.gradeAssignmentSubmission(assignmentId,studentId,markObtained,feedback)
        if(result == errors.UPDATE)
            throw Error(errors.UPDATE)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.UPDATE)
    }
}



/**
 * Create an assignment Submission
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
const createAssignmentSubmission = async (req, res, next) => {
    const {assignmentId,studentId, encodedFile} = req.body
    if(!assignmentId || !studentId || !encodedFile)
        throw Error(errors.CREATE)
    try {
        const result = await assignmentSubmissionService.createAssignmentSubmission(assignmentId, studentId, encodedFile)
        if(result == errors.CREATE || result == errors.USER_NOT_FOUND)
            throw Error(errors.CREATE)
        res.status(201).json(result)
    } catch (err) {
        throw Error(errors.CREATE)
    }
}

/**
 * Get all assignment Submission of a student 
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getAllAssignmentSubmissionStudent = async (req, res, next) => {
    const studentId = req.params.studentid
    if(!studentId)
        throw Error(errors.GET)
    try {
        const result = await assignmentSubmissionService.getAllAssignmentSubmissionStudent(studentId)
        if(result == errors.GET || result == errors.USER_NOT_FOUND)
            throw Error(errors.GET)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}




/**
 * Get all assignment Submission of a course 
 *
 * @param {requset object} req
 * @param {response object} res
 * @param {next middleware caller} next
 */
 const getAllAssignmentSubmissionSpecific = async (req, res, next) => {
    const courseId = req.params.courseid
    const assignmentId = req.params.assignmentid
    if(!courseId || !assignmentId)
        throw Error(errors.GET)
    try {
        const result = await assignmentSubmissionService.getAllAssignmentSubmissionSpecific(courseId,assignmentId)
        if(result == errors.GET)
            throw Error(errors.GET)
        res.status(200).json(result)
    } catch (err) {
        throw Error(errors.GET)
    }
}




module.exports = {
    getAllAssignmentSubmission,
    getSpecificAssignmentSubmission,
    gradeAssignmentSubmission,
    createAssignmentSubmission,
    getAllAssignmentSubmissionStudent,
    getAllAssignmentSubmissionSpecific
}