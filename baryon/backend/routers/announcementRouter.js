const announcementRouter = require('express').Router()
const announcementController = require('../controllers/announcementController')
const middleware = require('../utils/middleware')

/* GET announcements by student */
announcementRouter.get('/', middleware.isAuthenticated, announcementController.getForStudent)

/* GET announcements by course */
announcementRouter.get('/:courseid', middleware.isMember, announcementController.getCourseAnnouncement)

/* POST a announcement */
announcementRouter.post('/:courseid', middleware.isInstructor, announcementController.create)

/* GET a announcement */
announcementRouter.get('/:courseid/:id', middleware.isMember, announcementController.getOne)

/* PUT a announcement */
announcementRouter.put('/:courseid/:id', middleware.isInstructor, announcementController.update)

/* DELETE a announcement */
announcementRouter.delete('/:courseid/:id', middleware.isInstructor, announcementController.remove)

module.exports = announcementRouter