const Answer = require('../models/answer')
const Post = require('../models/post')
const Student = require('../models/student')
const errors = require('../utils/errors')

// gets all answers for post
const getPostAnswers = async (pid) => {
    const answers = await Answer.find({
        postId: pid
    })

    return answers
}

// gets single answer with id
const getOne = async (id) => {
    const answer = await Answer.findById(id)
    return answer
}

// creates answer
const create = async (answer, pid, cid, user) => {
    const s = await Student.findById(user.id)
    const student = s? s.taCourses.some(course => course.equals(cid)) : false

    if(!await Post.findById(pid)) return errors.GET

    const a = new Answer({
        ...answer,
        userId: user.id,
        postId: pid,
        isStudent: student
    })
    const saved_a = await a.save()

    if(student) {
        await Post.findByIdAndUpdate(pid, {
            studentAnswer: saved_a._id
        })
    } else {
        await Post.findByIdAndUpdate(pid, {
            instructorAnswer: saved_a._id
        })
    }

    return saved_a
}

// update an answer
const update = async (answer, id, pid, cid, user) => {
    const ans = await Answer.findById(id)
    if(!ans || !ans.userId.equals(user.id)) return errors.NOT_AUTHORIZED

    if(!await Post.findById(pid)) return errors.GET

    const s = await Student.findById(user.id)
    const student = s? s.taCourses.some(course => course.equals(cid)) : false

    const a = await Answer.findByIdAndUpdate(id, {
        ...answer,
        userId: user.id,
        isStudent: student,
        postId: pid
    }, { new: true, runValidators: true })

    return a
}

// deletes an answer
const destroy = async (id, pid, cid, user) => {
    const ans = await Answer.findById(id)
    if(!ans || !ans.userId.equals(user.id)) return errors.NOT_AUTHORIZED
    if(!await Post.findById(pid)) return errors.GET

    await Answer.findByIdAndRemove(id)

    const s = await Student.findById(user.id)
    const student = s? s.taCourses.some(course => course.equals(cid)) : false

    if(student) {
        await Post.findByIdAndUpdate(pid, {
            studentAnswer: null
        })
    } else {
        await Post.findByIdAndUpdate(pid, {
            instructorAnswer: null
        })
    }

    return true
}

module.exports = {
    getOne,
    destroy,
    create,
    getPostAnswers,
    update
}