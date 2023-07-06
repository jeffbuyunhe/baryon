const courseRouter = require('express').Router()
const courseController = require('../controllers/courseController')
const middleware = require('../utils/middleware')

/* GET all courses */
courseRouter.get('/', courseController.getAll)

/* GET a course */
courseRouter.get('/:id', courseController.getOne)

/* GET all courses by organization id */
courseRouter.get('/organization/:id', courseController.getAllByOrgId)

/* POST a course */
courseRouter.post('/', middleware.isAdmin, courseController.create)

/* PUT a course */
courseRouter.put('/:id', middleware.isAdmin, courseController.update)

/* Add students,tas,instructors */
courseRouter.put('/add_users/:id', middleware.isAdmin, courseController.addUsers)

/* Remove students,tas,instructors */
courseRouter.put('/remove_users/:id', middleware.isAdmin, courseController.removeUsers)

/* Adds label to a course */
courseRouter.put('/add_label/:id', middleware.isInstructor, courseController.addLabel)

/* DELETE a course */
courseRouter.delete('/:id', middleware.isAdmin, courseController.remove)

module.exports = courseRouter