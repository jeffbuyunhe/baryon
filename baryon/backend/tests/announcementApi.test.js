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

beforeAll(async () => {
    await User.deleteMany({})
    await Announcement.deleteMany({})
    await Organization.deleteMany({})
    await Course.deleteMany({})
    await Instructor.deleteMany({})
    await Student.deleteMany({})

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
    await ins.save()

    let stu = new Student({
        _id: i.body.id
    })
    await stu.save()

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
    await c.save()

    ins.courses.push(c._id)
    await ins.save()

    stu.courses.push(c.id)
    await stu.save()
}, TIME_OUT*3)

test('announcements are returned as json', async () => {
    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

    const i = await api.get(`${endpoints.INSTRUCTORS_ENDPOINT}${res.body.id}`)

    await api.get(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('announcement creation', async () => {
    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

    const i = await api.get(`${endpoints.INSTRUCTORS_ENDPOINT}${res.body.id}`)

    await api.post(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            announcement: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body).toHaveLength(1)
})

test('announcement update', async () => {
    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

    const i = await api.get(`${endpoints.INSTRUCTORS_ENDPOINT}${res.body.id}`)

    const postRes = await api.post(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            announcement: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.put(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}/${postRes.body.id}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            announcement: 'sup guys 2'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const getRes = await api.get(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body).toHaveLength(2)
    expect(getRes.body[1].announcement).toBe('sup guys 2')
})

test('announcement delete', async () => {
    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

    const i = await api.get(`${endpoints.INSTRUCTORS_ENDPOINT}${res.body.id}`)

    const postRes = await api.post(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            announcement: 'sup guys'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api.delete(`${endpoints.ANNOUNCEMENTS_ENDPOINT}${i.body.courses[0]}/${postRes.body.id}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(204)
})

test('student get announcements', async () => {
    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

    const getRes = await api.get(`${endpoints.ANNOUNCEMENTS_ENDPOINT}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(getRes.body).toHaveLength(2)
})

afterAll(async () => {
    mongoose.connection.close()
})