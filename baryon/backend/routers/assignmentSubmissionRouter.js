const assignmentSubmissionRouter = require('express').Router()
const assignmentSubmissionController = require('../controllers/assignmentSubmissionController')

/* GET all AssignmentSubmission */
assignmentSubmissionRouter.get('/', assignmentSubmissionController.getAllAssignmentSubmission)

/*Get all assignmentSubmission of a student */
assignmentSubmissionRouter.get('/student/:studentid', assignmentSubmissionController.getAllAssignmentSubmissionStudent)

/*Get all assignmentSubmission within the course given the assignmentId*/
assignmentSubmissionRouter.get('/course/:courseid/:assignmentid', assignmentSubmissionController.getAllAssignmentSubmissionSpecific)

/* GET specific AssignmentSubmission*/
assignmentSubmissionRouter.get('/:assignmentid/:studentid', assignmentSubmissionController.getSpecificAssignmentSubmission)

/* POST a AssignmentSubmission(Including resubmitt) */
assignmentSubmissionRouter.post('/', assignmentSubmissionController.createAssignmentSubmission)

/*Update a AssignmentSubmission(Grading) */
assignmentSubmissionRouter.post('/grade', assignmentSubmissionController.gradeAssignmentSubmission)


module.exports = assignmentSubmissionRouter
