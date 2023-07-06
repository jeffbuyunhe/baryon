const courseMediaRouter = require('express').Router()
const courseMediaController = require('../controllers/courseMediaController')
const middleware = require('../utils/middleware')

/* GET all media */
courseMediaRouter.get('/', courseMediaController.getAll)

/* GET a media */
courseMediaRouter.get('/:id', courseMediaController.getOne)

/* POST a media */
courseMediaRouter.post('/',courseMediaController.create)

/* PUT a media */
courseMediaRouter.put('/:id', courseMediaController.update)

/* DELETE a media */
courseMediaRouter.delete('/:id', courseMediaController.remove)

module.exports = courseMediaRouter