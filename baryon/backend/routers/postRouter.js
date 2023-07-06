const postRouter = require('express').Router()
const postController = require('../controllers/postController')
const middleware = require('../utils/middleware')

/* GET all posts */
postRouter.get('/', postController.getAll)

/* GET a post */
postRouter.get('/:id', postController.getOne)

/* POST a post */
postRouter.post('/', middleware.isAnyMemberType, middleware.postExists, postController.create)

/* PUT a post */
postRouter.put('/:id', middleware.isPostAuthor, middleware.isInstructorOrAuth, middleware.isAdminOrAuth, middleware.postExists, postController.update)

/* add commments to post */
postRouter.put('/add_comments/:id', middleware.isAnyMemberType, postController.addComments)

/* delete comments from post */
postRouter.put('/delete_comments/:id', middleware.isCommentAuthor, middleware.isInstructorOrAuth, middleware.isAdminOrAuth, postController.deleteComments)

/* DELETE a post */
postRouter.delete('/:id', middleware.isPostAuthor, middleware.isInstructorOrAuth, middleware.isAdminOrAuth, postController.remove)

module.exports = postRouter