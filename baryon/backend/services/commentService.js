const Comment = require('../models/comment')
const Post = require('../models/post')
const Student = require('../models/student')

// gets all comments for post
const getPostComments = async (pid) => {
    const comments = await Comment.find({
        postId: pid
    }).populate('replies')

    return comments
}

// gets single comment with id
const getOne = async (id) => {
    const comment = await Comment.findById(id).populate('replies')
    return comment
}

// creates comment
const create = async (comment, pid, cid, user) => {
    const s = await Student.findById(user.id)
    const student = s? s.taCourses.some(course => course.equals(cid)) : false

    const post = await Post.findById(pid)
    if(!post) return errors.GET

    const c = new Comment({
        ...comment,
        userId: user.id,
        postId: pid,
        isStudent: student
    })
    const saved_c = await c.save()

    const comments = [...post.comments, saved_c._id]
    await Post.findByIdAndUpdate(pid, {
        comments: comments
    })

    return saved_c
}

// update an comment
const update = async (comment, id, pid, cid, user) => {
    const comm = await Comment.findById(id)
    if(!comm || !comm.userId.equals(user.id)) return errors.NOT_AUTHORIZED

    if(!await Post.findById(pid)) return errors.GET

    const s = await Student.findById(user.id)
    const student = s? s.taCourses.some(course => course.equals(cid)) : false

    const c = await Comment.findByIdAndUpdate(id, {
        ...comment,
        userId: user.id,
        isStudent: student,
        postId: pid
    }, { new: true, runValidators: true }).populate('replies')

    return c
}

// deletes an comment
const destroy = async (id, pid, user) => {
    const comm = await Comment.findById(id)
    if(!await Post.findById(pid)) return errors.GET
    if(!comm || !comm.userId.equals(user.id)) return errors.NOT_AUTHORIZED

    await Comment.findByIdAndRemove(id)

    const post = await Post.findById(pid)
    await Post.findByIdAndUpdate(pid, {
        comments: post.comments.filter(c => !c.equals(id))
    })

    return true
}

module.exports = {
    getOne,
    destroy,
    create,
    getPostComments,
    update
}