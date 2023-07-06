const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')
const Instructor = require('../models/instructor')

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
    await Instructor.deleteMany({})

    let u = new User(initialUsers[0])
    await u.save()
    let i = new Instructor({_id: u._id})
    await i.save()

    u = new User(initialUsers[1])
    await u.save()
    i = new Instructor({_id: u._id})
    await i.save()
}, TIME_OUT)

test('instructors are returned as json', async () => {
    await api
        .get(endpoints.INSTRUCTORS_ENDPOINT)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('all instructors returned', async () => {
    const res = await api.get(endpoints.INSTRUCTORS_ENDPOINT)
    expect(res.body).toHaveLength(2)
}, TIME_OUT)

test('a specific instructor can be found', async () => {
    const res = await api.get(endpoints.INSTRUCTORS_ENDPOINT)
    const contents = res.body.map(r => r.id.email)
    expect(contents).toContain(
      'saad.makrod@mail.utoronto.ca'
    )
}, TIME_OUT)

test('a specific instructor can be found at the id endpoint', async () => {
    const res = await api.get(endpoints.INSTRUCTORS_ENDPOINT)
    await api.get(`${endpoints.USERS_ENDPOINT}${res.body[0].id.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('instructor creation', async () => {
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

    await api.post(endpoints.INSTRUCTORS_ENDPOINT)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            id: u.body.id
        }).expect(201)
}, TIME_OUT)

test('instructor deleted', async () => {
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

    await api.post(endpoints.INSTRUCTORS_ENDPOINT)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            id: u.body.id
        }).expect(201)

    await api.delete(`${endpoints.INSTRUCTORS_ENDPOINT}${res.body.id}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(204)
}, TIME_OUT)

afterAll(async () => {
    await User.deleteMany({})
    await Instructor.deleteMany({})

    mongoose.connection.close()
})