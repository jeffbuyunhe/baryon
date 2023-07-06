const courseMaterialRouter = require('express').Router()
const courseMaterialController = require('../controllers/courseMaterialController')
const middleware = require('../utils/middleware')

/* GET all materials */
courseMaterialRouter.get('/', courseMaterialController.getAll)

/* GET a material */
courseMaterialRouter.get('/:id', courseMaterialController.getOne)

/* GET all material with same courseId and label */
courseMaterialRouter.get('/get_by_courseid/:courseId', courseMaterialController.getByCourseId)

/* POST a material */
courseMaterialRouter.post('/', courseMaterialController.create)

/* PUT a material */
courseMaterialRouter.put('/:id', courseMaterialController.update)

/* DELETE a material */
courseMaterialRouter.delete('/:id', courseMaterialController.remove)

module.exports = courseMaterialRouter