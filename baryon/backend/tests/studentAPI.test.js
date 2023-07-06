const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')
const Student = require('../models/student')

const api = supertest(app)
const TIME_OUT = 10000

const initialUsers = [
    {
        email: 'saad.makrod@mail.utoronto.ca',
        password: 'password123!',
        firstname: 'Saad',
        lastname: 'Makrod',
    },
    {
        email: 'saad.makrod@gmail.com',
        firstname: 'Saad',
        lastname: 'Makrod',
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    await Student.deleteMany({})

    let u = new User(initialUsers[0])
    await u.save()
    let s = new Student({_id: u._id})
    await s.save()

    u = new User(initialUsers[1])
    await u.save()
    s = new Student({_id: u._id})
    await s.save()
}, TIME_OUT)

test('students are returned as json', async () => {
    await api
        .get(endpoints.STUDENTS_ENDPOINT)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('all students returned', async () => {
    const res = await api.get(endpoints.STUDENTS_ENDPOINT)
    expect(res.body).toHaveLength(2)
}, TIME_OUT)

test('a specific student can be found', async () => {
    const res = await api.get(endpoints.STUDENTS_ENDPOINT)
    const contents = res.body.map(r => r.id.email)
    expect(contents).toContain(
      'saad.makrod@mail.utoronto.ca'
    )
}, TIME_OUT)

test('a specific student can be found at the id endpoint', async () => {
    const res = await api.get(endpoints.STUDENTS_ENDPOINT)
    await api.get(`${endpoints.USERS_ENDPOINT}${res.body[0].id.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('student creation', async () => {
    const u = await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
            type: 'ADMIN'
        }).expect(201)

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test.com',
            password: 'supersecurypassword!'
        }).expect(200)

    await api.post(endpoints.STUDENTS_ENDPOINT)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            id: u.body.id
        }).expect(201)
}, TIME_OUT)

test('student deleted', async () => {
    const u = await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test_4.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
            type: 'ADMIN'
        })

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_4.com',
            password: 'supersecurypassword!'
        }).expect(200)

    await api.post(endpoints.STUDENTS_ENDPOINT)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            id: u.body.id
        }).expect(201)

    await api.delete(`${endpoints.STUDENTS_ENDPOINT}${res.body.id}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(204)
}, TIME_OUT)

afterAll(async () => {
    await User.deleteMany({})
    await Student.deleteMany({})

    mongoose.connection.close()
})