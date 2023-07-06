const Reply = require('../models/reply')
const Comment = require('../models/comment')
const Student = require('../models/student')
const errors = require('../utils/errors')

// gets all replys for a comment
const getCommentReplies = async (cid) => {
    const replies = await Reply.find({
        commentId: cid
    })

    return replies
}

// gets single reply with id
const getOne = async (id) => {
    const reply = await Reply.findById(id)
    return reply
}

// creates reply
const create = async (reply, cid, courseId, user) => {
    const comment = Comment.findById(cid)
    if(!comment) throw Error(errors.GET)

    const s = await Student.findById(user.id)
    const student = s? s.taCourses.some(course => course.equals(courseId)) : false

    const r = await new Reply({
        ...reply,
        commentId: cid,
        userId: user.id,
        isStudent: student
    }).save()

    const rep = []
    if(comment.replies) rep.concat(comment.replies)
    rep.push(r._id)

    await Comment.findByIdAndUpdate(cid, {
        replies: rep
    })
    return r
}

// update an reply
const update = async (reply, id, cid, courseId, user) => {
    const rep = await Reply.findById(id)
    if(!rep || !rep.userId.equals(user.id)) return errors.NOT_AUTHORIZED

    if(!await Comment.findById(cid)) throw Error(errors.GET)

    const s = await Student.findById(user.id)
    const student = s? s.taCourses.some(course => course.equals(courseId)) : false

    const r = await Reply.findByIdAndUpdate(id, {
        ...reply,
        isStudent: student,
        commentId: cid
    }, { new: true, runValidators: true })

    return r
}

// deletes an reply
const destroy = async (id, cid, user) => {
    const reply = await Reply.findById(id)
    if(!reply || !reply.userId.equals(user.id)) return errors.NOT_AUTHORIZED

    const comment = await Comment.findById(cid)
    if(!comment) throw Error(errors.GET)

    await Reply.findByIdAndRemove(id)

    await Comment.findByIdAndUpdate(cid, {
        replies: comment.replies.filter(r => r.equals(id))
    })

    return true
}

module.exports = {
    getOne,
    destroy,
    create,
    getCommentReplies,
    update
}