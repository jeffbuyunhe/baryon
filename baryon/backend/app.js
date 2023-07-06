const config = require('./utils/config')
const endpoints = require('./utils/endpoints')

const express = require('express')
require('express-async-errors')
const app = express()

const homeRouter = require('./routers/homeRouter')
const notesRouter = require('./routers/notesRouter')

const organizationsRouter = require('./routers/organizationsRouter')
const usersRouter = require('./routers/usersRouter')
const studentsRouter = require('./routers/studentsRouter')
const instructorsRouter = require('./routers/instructorsRouter')
const registrationRouter = require('./routers/registrationRouter')
const courseRounter = require('./routers/courseRouter')
const postRouter = require('./routers/postRouter')
const discussionBoardRouter = require('./routers/discussionBoardRouter')
const assignmentSubmissionRouter = require('./routers/assignmentSubmissionRouter')
const assignmentRouter = require('./routers/assignmentRouter')
const courseFileRouter = require('./routers/courseFileRouter')
const announcementRounter = require('./routers/announcementRouter')
const commentRouter = require('./routers/commentRouter')
const replyRouter = require('./routers/replyRouter')
const answerRouter = require('./routers/answerRouter')
const courseMaterialRouter = require('./routers/courseMaterialRouter')
const courseMediaRouter = require('./routers/courseMediaRouter')

const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
// app.use(express.static('build'))   to be added when prod build is ready
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.userExtractor)

app.use(endpoints.BASE_URL, homeRouter)
app.use(endpoints.NOTES_ENDPOINT, notesRouter)
app.use(endpoints.ORGANIZATIONS_ENDPOINT, organizationsRouter)
app.use(endpoints.USERS_ENDPOINT, usersRouter)
app.use(endpoints.STUDENTS_ENDPOINT, studentsRouter)
app.use(endpoints.INSTRUCTORS_ENDPOINT, instructorsRouter)
app.use(endpoints.REGISTRATION_ENDPOINT, registrationRouter)
app.use(endpoints.COURSES_ENDPOINT,courseRounter)
app.use(endpoints.DISCUSSIONBOARD_ENDPOINT, discussionBoardRouter)
app.use(endpoints.POST_ENDPOINT, postRouter)
app.use(endpoints.ASSIGNMENTSUBMISSION_ENDPOINT,assignmentSubmissionRouter)
app.use(endpoints.ASSIGNMENT_ENDPOINT,assignmentRouter)
app.use(endpoints.COURSE_FILE_ENDPOINT,courseFileRouter)
app.use(endpoints.ANNOUNCEMENTS_ENDPOINT,announcementRounter)
app.use(endpoints.COMMENTS_ENDPOINT, commentRouter)
app.use(endpoints.ANSWERS_ENDPOINT, answerRouter)
app.use(endpoints.REPLIES_ENDPOINT, replyRouter)
app.use(endpoints.COURSE_MATERIALS_ENDPOINT,courseMaterialRouter)
app.use(endpoints.COURSE_MEDIA_ENDPOINT,courseMediaRouter)

app.use(middleware.errorHandler)

module.exports = app