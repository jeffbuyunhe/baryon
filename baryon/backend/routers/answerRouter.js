const answerRouter = require('express').Router()
const answerController = require('../controllers/answerController')
const middleware = require('../utils/middleware')

/* GET answers by student */
answerRouter.get('/:courseid/posts/:postid', middleware.isMember, answerController.getPostAnswer)

/* POST a answer */
answerRouter.post('/:courseid/posts/:postid', middleware.isMember, answerController.create)

/* GET answers by course */
answerRouter.get('/:courseid/posts/:postid/:id', middleware.isMember, answerController.getOne)

/* PUT a answer */
answerRouter.put('/:courseid/posts/:postid/:id', middleware.isMember, answerController.update)

/* DELETE a answer */
answerRouter.delete('/:courseid/posts/:postid/:id', middleware.isMember, answerController.remove)

module.exports = answerRouter