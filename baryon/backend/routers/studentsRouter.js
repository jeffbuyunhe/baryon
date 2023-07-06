const studentsRouter = require('express').Router()
const studentsController = require('../controllers/studentsController')
const middleware = require('../utils/middleware')

/* GET students */
studentsRouter.get('/', studentsController.getAll)

/* GET student */
studentsRouter.get('/:id', studentsController.getOne)

/* GET students by organization id */
studentsRouter.get('/organization/:id', studentsController.getAllByOrgId)

/* POST student */
studentsRouter.post('/', middleware.isAdmin, studentsController.create)

/* DELETE student */
studentsRouter.delete('/:id', middleware.isAuthenticated, studentsController.remove)

/* ADD COURSE to student */
studentsRouter.put('/:id/add-course', middleware.isAdmin, studentsController.addCourse)

/* DELETE COURSE from student */
studentsRouter.put('/:id/remove-course', middleware.isAdmin, studentsController.removeCourse)

/* ADD TA COURSE to student */
studentsRouter.put('/:id/add-ta-course', middleware.isAdmin, studentsController.addTACourse)

/* DELETE TA COURSE from student */
studentsRouter.put('/:id/remove-ta-course', middleware.isAdmin, studentsController.removeTACourse)

module.exports = studentsRouter
