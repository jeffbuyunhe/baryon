const commentRouter = require('express').Router()
const commentController = require('../controllers/commentController')
const middleware = require('../utils/middleware')

/* GET comments by student */
commentRouter.get('/:courseid/posts/:postid', middleware.isMember, commentController.getPostComments)

/* POST a comment */
commentRouter.post('/:courseid/posts/:postid', middleware.isMember, commentController.create)

/* GET comments by course */
commentRouter.get('/:courseid/posts/:postid/:id', middleware.isMember, commentController.getOne)

/* PUT a comment */
commentRouter.put('/:courseid/posts/:postid/:id', middleware.isMember, commentController.update)

/* DELETE a comment */
commentRouter.delete('/:courseid/posts/:postid/:id', middleware.isMember, commentController.remove)

module.exports = commentRouter