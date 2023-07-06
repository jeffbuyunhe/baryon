const replyRouter = require('express').Router()
const replyController = require('../controllers/replyController')
const middleware = require('../utils/middleware')

/* GET replies by student */
replyRouter.get('/:courseid/comments/:commentid', middleware.isMember, replyController.getCommentReplies)

/* POST a reply */
replyRouter.post('/:courseid/comments/:commentid', middleware.isMember, replyController.create)

/* GET replies by course */
replyRouter.get('/:courseid/comments/:commentid/:id', middleware.isMember, replyController.getOne)

/* PUT a reply */
replyRouter.put('/:courseid/comments/:commentid/:id', middleware.isMember, replyController.update)

/* DELETE a reply */
replyRouter.delete('/:courseid/comments/:commentid/:id', middleware.isMember, replyController.remove)

module.exports = replyRouter