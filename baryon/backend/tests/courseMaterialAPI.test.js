const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')
const Student = require('../models/student')
const Instructor = require('../models/instructor')
const Organization = require('../models/organization')
const Course = require('../models/course')
const CourseFile = require('../models/courseFile')
const CourseMaterial = require('../models/courseMaterial')
const api = supertest(app)
const TIME_OUT = 1000

const orgs = [
    {
        name: 'University of Toronto',
        admins: [],
        
    },
    {
        name: 'WaterLoo',
        admins: [],
        
    }
]
const courses = [
    {
        name: 'Databases',
        courseCode: 'CSCC43',
        
    },
    {
        name: 'Basic Programming',
        courseCode: 'CSCA01',

    }
]


const users = [
    {
        email: 'saad.makrod@mail.utoronto.ca',
        firstname: 'Saad',
        lastname: 'Makrod',
    },
    {
        email: 'jasonh@mail.uwaterloo.com',
        firstname: 'jason',
        lastname: 'hyde',
    },
    {
        email: 'vassos.hadzilacos@mail.utoronto.ca',
        firstname:'Vassos',
        lastname:'Hadzilacos'
    }
]

let file_id
let material_id
beforeAll(async () => {
    await User.deleteMany({})
    await Course.deleteMany({})
    await Student.deleteMany({})
    await Instructor.deleteMany({})
    await Organization.deleteMany({})
    await CourseMaterial.deleteMany({})
    let a = new Organization(orgs[0])
    await a.save()
    orgs[0]._id = a._id;
    let b = new Organization(orgs[1])
    orgs[1]._id = b._id;
    await b.save()

    courses[0].organizationId = orgs[0]._id;
    let c = new Course(courses[0])
    await c.save()
    courses[0]._id = c._id

    courses[1].organizationId = orgs[1]._id;
    c = new Course(courses[1])
    await c.save()
    courses[1]._id = c._id
    
    
    users[0].organizationId = orgs[0]._id;
    let u = new User(users[0])
    await u.save()
    users[0]._id = u._id

    users[1].organizationId = orgs[1]._id;
    u = new User(users[1])
    await u.save()
    users[1]._id = u._id

    users[2].organizationId = orgs[0]._id;
    u = new User(users[2])
    await u.save()
    users[2]._id = u._id

    let s = new Student({_id: users[0]._id})
    await s.save()

    s = new Student({_id: users[1]._id})
    await s.save()

    i = new Instructor({_id: users[2]._id})
    await i.save()

    f = new CourseFile({courseId: courses[0]._id})
    await f.save()

    g = new CourseFile({courseId: courses[0]._id})
    await g.save()

    file_id = f._id;

    file_id2 = g._id




})

describe('Basic CRUD tests', () => {
    //test POST endpoint / - pass
    test('A new material can created',async () =>{
        let a = await api.post(endpoints.COURSE_MATERIALS_ENDPOINT).send(
            {
                label:"assignment",
                title:"A Material for Assignment1",
                courseId:courses[0]._id,
                courseFileId: file_id,
            }
        ).expect(201)
        material_id = a.body.id
        
    },TIME_OUT)
    //test POST endpoint / - fail
    test('Material without sufficient data',async () =>{
        console.log(orgs[0]._id)
        let a = await api.post(endpoints.COURSE_MATERIALS_ENDPOINT).send(
            {
                label:"I dont have enough data"
            }
        ).expect(400)
        
    },TIME_OUT)
    //test endpoint GET / 
    test('All Materials can be found', async () => {
        const res = await api.get(endpoints.COURSE_MATERIALS_ENDPOINT)
        expect(res.body).toHaveLength(1)
    },TIME_OUT)
    
    //test endpoint GET /:id pass
    test('A material can be found', async () => {
        await api.get(`${endpoints.COURSE_MATERIALS_ENDPOINT}${material_id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, TIME_OUT)
    //test endpoint GET /:id fail
        test('A material isnt found', async () => {
            await api.get(`${endpoints.COURSE_MATERIALS_ENDPOINT}${"big_chungus"}`)
                .expect(400)
                .expect('Content-Type', /application\/json/)
        }, TIME_OUT)
    //test endpoint PUT /:id pass
    test('Changing material Title and Label',async()=>{
        
        const res = await api.put(`${endpoints.COURSE_MATERIALS_ENDPOINT}${material_id}`).send({
            title:"A new kind of assignment",
            label:"Resource"
        }).expect(200).expect('Content-Type', /application\/json/)
        
        expect(res.body['title']).toBe("A new kind of assignment")
        expect(res.body.label).toBe('Resource')
    })
    //test endpoint PUT /:id fail
        test('Changing material Title and Label',async()=>{
        
            const res = await api.put(`${endpoints.COURSE_MATERIALS_ENDPOINT}${"big_chungus"}`).send({
                title:"A new kind of assignment",
                label:"Resource"
            }).expect(400).expect('Content-Type', /application\/json/)

        })
    //test endpoint getbylabel /:id pass
    test('Get all material that has same courseid ',async()=>{
        let a = await api.post(endpoints.COURSE_MATERIALS_ENDPOINT).send(
            {
                label:"assignment",
                title:"A Material for Assignment1",
                courseId:courses[0]._id,
                courseFileId: file_id,
            }
        ).expect(201)

        let b = await api.post(endpoints.COURSE_MATERIALS_ENDPOINT).send(
            {
                label:"assignment",
                title:"A Material for Assignment2",
                courseId:courses[0]._id,
                courseFileId: file_id2,
            }
        ).expect(201)

        const courseId = courses[0]._id.toString()

        const res = await api.get(`${endpoints.COURSE_MATERIALS_ENDPOINT}get_by_courseid/${courseId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveLength(2)
    })
    //test endpoint Delete /:id pass and fail
    test('Our new material was deleted',async()=>{
        await api.delete(`${endpoints.COURSE_MATERIALS_ENDPOINT}${material_id}`).expect(204)
        await api.delete(`${endpoints.COURSE_MATERIALS_ENDPOINT}${material_id}`).expect(400)
    })


})

afterAll(async () => {
    await User.deleteMany({})
    await Course.deleteMany({})
    await Student.deleteMany({})
    await Instructor.deleteMany({})
    await Organization.deleteMany({})
    await CourseFile.deleteMany({})
    await CourseMaterial.deleteMany({})
    mongoose.connection.close()
})


