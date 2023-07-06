const registrationRouter = require('express').Router()
const registrationController = require('../controllers/registrationController')
const middleware = require('../utils/middleware')

const os = require('os')
const multer  = require('multer')
const upload = multer({ dest: os.tmpdir() })

/* REGISTER STUDENTS */
registrationRouter.post('/students', middleware.isAdmin, upload.single('file'), registrationController.registerStudents)

/* REGISTER INSTRUCTORS */
registrationRouter.post('/instructors', middleware.isAdmin, upload.single('file'), registrationController.registerInstructors)

/* REGISTER COURSES */
registrationRouter.post('/courses', middleware.isAdmin, upload.single('file'), registrationController.registerCourses)

/* REGISTER STUDENTS TO COURSE */
registrationRouter.post('/course-students/:id', middleware.isAdmin, upload.single('file'), registrationController.registerStudentsToCourse)

/* REGISTER INSTRUCTORS TO COURSE */
registrationRouter.post('/course-instructors/:id', middleware.isAdmin, upload.single('file'), registrationController.registerInstructorsToCourse)

module.exports = registrationRouter
