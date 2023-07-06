const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')

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
    let u = new User(initialUsers[0])
    await u.save()
    u = new User(initialUsers[1])
    await u.save()
}, TIME_OUT)

test('users are returned as json', async () => {
    await api
        .get(endpoints.USERS_ENDPOINT)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('all users returned', async () => {
    const res = await api.get(endpoints.USERS_ENDPOINT)
    expect(res.body).toHaveLength(2)
}, TIME_OUT)

test('a specific user can be found', async () => {
    const res = await api.get(endpoints.USERS_ENDPOINT)
    const contents = res.body.map(r => r.email)
    expect(contents).toContain(
      'saad.makrod@mail.utoronto.ca'
    )
}, TIME_OUT)

test('a specific user can be found at the id endpoint', async () => {
    const res = await api.get(endpoints.USERS_ENDPOINT)
    await api.get(`${endpoints.USERS_ENDPOINT}${res.body[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, TIME_OUT)

test('user creation', async () => {
    await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
        }).expect(201)
}, TIME_OUT)

test('login', async () => {
    await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test_2.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
        })

    await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_2.com',
            password: 'supersecurypassword!'
        }).expect(200)
}, TIME_OUT)

test('user put operation', async () => {
    await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test_3.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
        })

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_3.com',
            password: 'supersecurypassword!'
        })

    const putRes = await api.put(`${endpoints.USERS_ENDPOINT}${res.body.id}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            email: 'testy@super_good_test_5555.com',
            firstname: 'Testy2',
            lastname: 'Supertest',
            isAdmin: true
        })
    expect(putRes.body.email).toBe('testy@super_good_test_3.com')
    expect(putRes.body.isAdmin).toBe(false)
    expect(putRes.body.firstname).toBe('Testy2')
    expect(putRes.body.lastname).toBe('Supertest')
}, TIME_OUT)

test('user deleted', async () => {
    await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test_4.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
        })

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_4.com',
            password: 'supersecurypassword!'
        })

    await api.delete(`${endpoints.USERS_ENDPOINT}${res.body.id}`)
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(204)
}, TIME_OUT)

test('user password reset', async () => {
    const u = await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test_5.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
        })

    const token = await api.post(`${endpoints.USERS_ENDPOINT}password-reset`)
        .send({
            email: 'testy@super_good_test_5.com',
        })

    await api.post(`${endpoints.USERS_ENDPOINT}password-reset-confirm`)
        .send({
            password: 'supersecurypassword2!',
            token: token.body.token,
            id: u.body.id
        }).expect(200)

    await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_5.com',
            password: 'supersecurypassword2!'
        }).expect(200)
}, TIME_OUT)

test('user email reset', async () => {
    const u = await api.post(endpoints.USERS_ENDPOINT)
        .send({
            email: 'testy@super_good_test_6.com',
            password: 'supersecurypassword!',
            firstname: 'Testy',
            lastname: 'Supertest',
        }).expect(201)

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_6.com',
            password: 'supersecurypassword!'
        })

    await api.post(`${endpoints.USERS_ENDPOINT}${u.body.id}/email-reset`)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            email: 'testy@super_good_test_7.com',
        }).expect(200)

    await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_7.com',
            password: 'supersecurypassword!'
        }).expect(200)
}, TIME_OUT)

test('check user verified', async () => {
    await api.post(endpoints.USERS_ENDPOINT)
    .send({
        email: 'testy@super_good_test_9.com',
        password: 'supersecurypassword!',
        firstname: 'Testy',
        lastname: 'Supertest',
    }).expect(201)

    const res = await api.post(`${endpoints.USERS_ENDPOINT}is-verified`)
        .send({
            email: 'testy@super_good_test_9.com',
        })

    expect(res.body.verified).toBe(false)
}, TIME_OUT)

test('user me endpoint', async () => {
    await api.post(endpoints.USERS_ENDPOINT)
    .send({
        email: 'testy@super_good_test_10.com',
        password: 'supersecurypassword!',
        firstname: 'Testy',
        lastname: 'Supertest',
    }).expect(201)

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'testy@super_good_test_10.com',
            password: 'supersecurypassword!'
        })

    const res2 = await api.post(`${endpoints.USERS_ENDPOINT}me`)
        .set('Authorization', `bearer ${res.body.token}`)
        .send({
            email: 'testy@super_good_test_10.com',
        })

    expect(res2.body.email).toBe('testy@super_good_test_10.com')
    expect(res2.body.firstname).toBe('Testy')
    expect(res2.body.lastname).toBe('Supertest')
}, TIME_OUT)

afterAll(async () => {
    await User.deleteMany({})
    mongoose.connection.close()
})