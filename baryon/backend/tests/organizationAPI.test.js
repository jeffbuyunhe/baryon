const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')
const Organization = require('../models/organization')

const api = supertest(app)
const TIME_OUT = 10000

const orgs = [
    {
        name: 'UofA',
        admins: []
    },
    {
        name: 'UofB',
        admins: []
    }
]

beforeAll(async () => {
    await User.deleteMany({})
    await Organization.deleteMany({})
    let a = new Organization(orgs[0])
    await a.save()
    let b = new Organization(orgs[1])
    await b.save()
})

describe('Basic CRUD tests', () => {
    test('Organization named UofT is created and returned as object', async () => {
        await api.post(endpoints.ORGANIZATIONS_ENDPOINT)
            .send({
                name: 'UofT',
            }).expect(201)
    }, TIME_OUT)

    test('All Organizations can be found and returned as JSON', async () => {
        const res = await api.get(endpoints.ORGANIZATIONS_ENDPOINT)
        expect(res.body).toHaveLength(3)
    })

    test('Organization named UofT returned as object at specfic get by ID endpoint', async () => {
        const res = await api.get(endpoints.ORGANIZATIONS_ENDPOINT)
        await api.get(`${endpoints.ORGANIZATIONS_ENDPOINT}${res.body[0].id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, TIME_OUT)

    test('Put Endpoint adds Admin user b', async () => {
        const org = await api.get(endpoints.ORGANIZATIONS_ENDPOINT)
        const b = new User({
            email: 'abc@mail.utoronto.ca',
            password: 'password123!',
            firstname: 'b',
            lastname: 'bb',
            isAdmin: true,
            organizationId: org.body[0].id
        })
        await b.save()
        const userB = await (await User.find({}, {"_id": 1})).map(x => x._id.toString())
        const res = await api.put(`${endpoints.ORGANIZATIONS_ENDPOINT}${org.body[0].id}`)
            .send({
                admins: userB,
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body['admins']).toHaveLength(1)

    }, TIME_OUT)

    test('Put Endpoint does not add user a', async () => {
        const org = await api.get(endpoints.ORGANIZATIONS_ENDPOINT)
        const b = new User({
            email: 'efg@mail.utoronto.ca',
            password: 'password12345!',
            firstname: 'a',
            lastname: 'aa',
            isAdmin: false,
            organizationId: org.body[0].id
        })
        await b.save()
        const userB = await (await User.find({"firstname": "a"}, {"_id": 1})).map(x => x._id.toString())
        const res = await api.put(`${endpoints.ORGANIZATIONS_ENDPOINT}${org.body[0].id}`)
            .send({
                admins: userB,
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body['admins']).toHaveLength(1)

    }, TIME_OUT)

    test('Put Endpoint adds user c', async () => {
        const org = await api.get(endpoints.ORGANIZATIONS_ENDPOINT)
        const b = new User({
            email: 'efghi@mail.utoronto.ca',
            password: 'password45!',
            firstname: 'c',
            lastname: 'cc',
            isAdmin: true,
            organizationId: org.body[0].id
        })
        await b.save()
        const userB = await (await User.find({"firstname": "c"}, {"_id": 1})).map(x => x._id.toString())
        const res = await api.put(`${endpoints.ORGANIZATIONS_ENDPOINT}${org.body[0].id}`)
            .send({
                admins: userB,
                updateValue: 2
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body['admins']).toHaveLength(2)

    }, TIME_OUT)

    test('Put Endpoint removes user b from admins', async () => {
        const org = await api.get(endpoints.ORGANIZATIONS_ENDPOINT)
        const userB = await (await User.find({"firstname": "b"}, {"_id": 1})).map(x => x._id.toString())
        const res = await api.put(`${endpoints.ORGANIZATIONS_ENDPOINT}${org.body[0].id}`)
            .send({
                admins: userB,
                updateValue: 1
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body['admins']).toHaveLength(1)

    }, TIME_OUT)

    test('Put Endpoint changes org name from UofT to University of Toronto', async () => {
        const org = await (await Organization.find({"name": "UofT"}, {"_id": 1})).map(x => x._id.toString())
        const orgID = org[0]
        const res = await api.put(`${endpoints.ORGANIZATIONS_ENDPOINT}${orgID}`)
            .send({
                name: "University of Toronto"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body['name']).toBe('University of Toronto')
        expect(res.body['admins']).toHaveLength(0)
    })

    test('Delete endpoint removes University of Toronto org', async () => {
        const org = await (await Organization.find({"name": "University of Toronto"}, {"_id": 1})).map(x => x._id.toString())
        console.log(org, "ORG")
        const orgID = org[0]
        await api.delete(`${endpoints.ORGANIZATIONS_ENDPOINT}${orgID}`)
            .expect(204)

        const deletedOrg = await (await Organization.find({"name": "University of Toronto"}, {"_id": 1})).map(x => x._id.toString())

        expect(deletedOrg).toHaveLength(0)

    })

})

afterAll(async () => {
    await User.deleteMany({})
    await Organization.deleteMany({})
    mongoose.connection.close()
})

