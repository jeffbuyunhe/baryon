const discussionBoardRouter = require('express').Router()
const discussionBoardController = require('../controllers/discussionBoardController')
const middleware = require('../utils/middleware')

/* GET all forums */
discussionBoardRouter.get('/', discussionBoardController.getAll)

/* GET a forum */
discussionBoardRouter.get('/:id', middleware.isAnyMemberType, discussionBoardController.getOne)

/* POST a forum */
discussionBoardRouter.post('/', middleware.isAnyMemberType, discussionBoardController.create)

/* PUT a forum */
discussionBoardRouter.put('/:id', middleware.isAnyMemberType, discussionBoardController.update)

/* Add post to forum */
discussionBoardRouter.put('/add_posts/:id', middleware.isAnyMemberType, discussionBoardController.addPosts)

/* Delete a post from forum */
discussionBoardRouter.put('/delete_posts/:id', middleware.isPostAuthor, middleware.isInstructorOrAuth, middleware.isAdminOrAuth, discussionBoardController.deletePosts)

/* DELETE a forum */
discussionBoardRouter.delete('/:id', middleware.isAnyMemberType, discussionBoardController.remove)

module.exports = discussionBoardRouter