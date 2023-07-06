const courseFileRouter = require('express').Router()
const courseFileController = require('../controllers/courseFileController')
const middleware = require('../utils/middleware')

/* GET all files meta-data */
courseFileRouter.get('/', courseFileController.getAll)

/* GET a files meta-data*/
courseFileRouter.get('/:id', courseFileController.getOne)

/* GET Download a file*/
courseFileRouter.get('/download/:id', courseFileController.download)

/* POST Upload a file to MongoDb and create a new file */
courseFileRouter.post('/',middleware.courseFileInfo,  middleware.courseFileUpload.single('file'), courseFileController.upload)

/* POST Upload multiple files to MongoDb and create new files */
courseFileRouter.post('/bulk', middleware.courseFileInfo,  middleware.courseFileUploadArray, courseFileController.uploadMany)

/* Delete a file */
courseFileRouter.delete('/:id', courseFileController.remove) 

module.exports = courseFileRouter