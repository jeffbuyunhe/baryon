const usersRouter = require('express').Router()
const usersController = require('../controllers/usersController')
const middleware = require('../utils/middleware')

/* GET users */
usersRouter.get('/', usersController.getAll)

/* GET user */
usersRouter.get('/:id', usersController.getOne)

/* POST user */
usersRouter.post('/', usersController.create)

/* PUT user */
usersRouter.put('/:id', middleware.isAuthenticated, usersController.update)

/* DELETE user */
usersRouter.delete('/:id', middleware.isAuthenticated, usersController.remove)

/* LOGIN user */
usersRouter.post('/login', usersController.login)

/* RESET user PASSWORD */
usersRouter.post('/password-reset', usersController.passwordReset)

/* CONFIRM NEW user PASSWORD */
usersRouter.post('/password-reset-confirm', usersController.passwordResetConfirm)

/* RESET user EMAIL */
usersRouter.post('/:id/email-reset', middleware.isAuthenticated, usersController.emailReset)

/* ACTIVATE user */
usersRouter.post('/:id/activate', usersController.activate)

/* CHECK IF user VERIFIED */
usersRouter.get('/is-verified/:email', usersController.isVerified)

/* GET CURRENT user */
usersRouter.get('/user/me', middleware.isAuthenticated, usersController.currentUser)

module.exports = usersRouter
