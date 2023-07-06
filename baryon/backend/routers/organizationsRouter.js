const organizationsRouter = require('express').Router()
const organizationsController = require('../controllers/organizationsController')
const middleware = require('../utils/middleware')

/* GET organizations */
organizationsRouter.get('/', organizationsController.getAll)

/* GET an organization */
organizationsRouter.get('/:id', organizationsController.getOne)

/* GET an organization by name */
organizationsRouter.get('/name/:name', organizationsController.getOneByName)

/* POST organization */
organizationsRouter.post('/', organizationsController.create)

/* PUT organization */
organizationsRouter.put('/:id', organizationsController.update)

/* DELETE organization */
organizationsRouter.delete('/:id', organizationsController.remove)

module.exports = organizationsRouter
