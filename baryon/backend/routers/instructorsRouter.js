const instructorsRouter = require('express').Router()
const instructorsController = require('../controllers/instructorsController')
const middleware = require('../utils/middleware')

/* GET instructors */
instructorsRouter.get('/', instructorsController.getAll)

/* GET instructor */
instructorsRouter.get('/:id', instructorsController.getOne)

/* GET all instructors by organization id */
instructorsRouter.get('/organization/:id', instructorsController.getAllByOrgId)

/* POST instructor */
instructorsRouter.post('/', middleware.isAdmin, instructorsController.create)

/* DELETE instructor */
instructorsRouter.delete('/:id', middleware.isAuthenticated, instructorsController.remove)

/* ADD COURSE to instructor */
instructorsRouter.put('/:id/add-course', middleware.isAdmin, instructorsController.addCourse)

/* DELETE COURSE from instructor */
instructorsRouter.put('/:id/remove-course', middleware.isAdmin, instructorsController.removeCourse)

module.exports = instructorsRouter
