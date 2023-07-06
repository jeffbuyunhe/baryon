const assignmentRouter = require('express').Router()
const assignmentController = require('../controllers/assignmentController')


/* POST an assignment for a specific course */
assignmentRouter.post('/', assignmentController.create)

/* Get all assignment for a specific course */
assignmentRouter.get('/course/:courseid', assignmentController.getCourseAll)

/* Get a specific student's all assignment */
assignmentRouter.get('/student/:studentid', assignmentController.getStudentAll)

/* Get a specific student's all assignment for a specific course */
assignmentRouter.get('/:studentid/:courseid', assignmentController.getStudentInCourse)

/*Delete a specific assignment in a specific course */
assignmentRouter.post('/delete', assignmentController.deleteAssignment)

/*Update an assignment details (i.e. total marks dueDate and etc) */
assignmentRouter.post('/update', assignmentController.updateAssignment)

module.exports = assignmentRouter
