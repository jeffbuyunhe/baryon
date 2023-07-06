const notesRouter = require('express').Router()
const notesController = require('../controllers/notesController')

/* GET notes */
notesRouter.get('/', notesController.getAll)

/* GET note */
notesRouter.get('/:id', notesController.getOne)

/* POST note */
notesRouter.post('/', notesController.create)

/* PUT note */
notesRouter.put('/:id', notesController.update)

/* DELETE note */
notesRouter.delete('/:id', notesController.remove)

module.exports = notesRouter
