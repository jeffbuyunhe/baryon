const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')
const Announcement = require('../models/announcement')
const Organization = require('../models/organization')
const Course = require('../models/course')
const Instructor = require('../models/instructor')
const Student = require('../models/student')
const Post = require('../models/post')

const api = supertest(app)
const TIME_OUT = 10000

const initialUser = {
    email: 'saad.makrod@gmail.com',
    firstname: 'Saad',
    lastname: 'Makrod',
    password: 'password123!',
    type: 'ADMIN',
}

const initialOrg = {
    name: 'UofT',
}

const initialIns = {
    email: 'saad.makrod@mail.utoronto.ca',
    firstname: 'Saad',
    lastname: 'Makrod',
    password: 'password123!',
}

const initialCourse = {
    name: 'Software Engineering',
    courseCode: 'CSCC01'
}

const post = {
    title: 'Test',
    content: 'Testy test test',
}

var COURSE_ID = null
var USER_ID = null
var ADMIN_ID = null
var TOKEN = null
var ADMIN_TOKEN = null
var POST_ID = null

beforeAll(async () => {
    await User.deleteMany({})
    await Announcement.deleteMany({})
    await Organization.deleteMany({})
    await Course.deleteMany({})
    await Instructor.deleteMany({})
    await Student.deleteMany({})
    await Post.deleteMany({})

    let org = new Organization({
        ...initialOrg,
    })
    await org.save()

    let u = await api.post(endpoints.USERS_ENDPOINT).send({
        ...initialUser,
        organizationId: org._id
    })

    org.admins.push(u.body.id)
    org.save()

    let u2 = await User.findById(u.body.id)
    u2.organizationId = org._id
    await u2.save()

    let i = await api.post(endpoints.USERS_ENDPOINT).send({
        ...initialIns,
        organizationId: org._id
    })

    let ins = new Instructor({
        _id: i.body.id
    })
    const a = await ins.save()
    ADMIN_ID = a._id

    let stu = new Student({
        _id: i.body.id
    })
    const b = await stu.save()
    USER_ID = b._id

    let c = new Course({
        ...initialCourse,
        organizationId: org._id,
        instructors: [
            ins._id
        ],
        students: [
            stu._id
        ]
    })
    const d = await c.save()
    COURSE_ID = d._id

    ins.courses.push(COURSE_ID)
    await ins.save()

    stu.courses.push(COURSE_ID)
    await stu.save()

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    TOKEN = res.body.token

    const p = await new Post({
        ...post,
        author: res.body.id,
        courseid: COURSE_ID
    }).save()
    POST_ID = p._id
}, TIME_OUT*4)

test('answers are returned as json', async () => {
    await api.get(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('comments are returned as json', async () => {
    await api.get(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('answer creation', async () => {
    await api.post(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            answer: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
    .set('Authorization', `bearer ${TOKEN}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(getRes.body).toHaveLength(1)
})

test('comment creation', async () => {
    const res = await api.post(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body).toHaveLength(1)
})

test('answer update', async () => {
    const postRes = await api.post(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            answer: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.put(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            answer: 'hi'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body.answer).toBe('hi')
})

test('comment update', async () => {
    const postRes = await api.post(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.put(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'hi'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body.comment).toBe('hi')
})

test('answer delete', async () => {
    const postRes = await api.post(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            answer: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.delete(`${endpoints.ANSWERS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(204)
})

test('comment delete', async () => {
    const postRes = await api.post(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.delete(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(204)
})

test('replies are returned as json', async () => {
    const postRes = await api.post(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.get(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('reply creation', async () => {
    const postRes = await api.post(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res = await api.post(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            reply: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body).toHaveLength(1)
})

test('reply update', async () => {
    const postRes = await api.post(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res2 = await api.post(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            reply: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const u = await api.put(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}/${res2.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            reply: 'hi'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}/${res2.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body.reply).toBe('hi')
})

test('reply delete', async () => {
    const postRes = await api.post(`${endpoints.COMMENTS_ENDPOINT}${COURSE_ID}/posts/${POST_ID}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            comment: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res2 = await api.post(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .send({
            reply: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.delete(`${endpoints.REPLIES_ENDPOINT}${COURSE_ID}/comments/${postRes.body.id}/${res2.body.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(204)
})

afterAll(async () => {
    mongoose.connection.close()
})