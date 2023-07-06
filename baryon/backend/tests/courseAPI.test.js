const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')
const Student = require('../models/student')
const Instructor = require('../models/instructor')
const Organization = require('../models/organization')
const Course = require('../models/course')

const api = supertest(app)
const TIME_OUT = 10000

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



beforeAll(async () => {
    await User.deleteMany({})
    await Course.deleteMany({})
    await Student.deleteMany({})
    await Instructor.deleteMany({})
    await Organization.deleteMany({})

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




})

describe('Basic CRUD tests', () => {

    //test endpoint GET /
    test('All Courses can be found and returned as JSON', async () => {
        const res = await api.get(endpoints.COURSES_ENDPOINT)
        expect(res.body).toHaveLength(2)
    },TIME_OUT)
    
    //test endpoint GET /:id
    test('A Course can be found and is returned', async () => {
        await api.get(`${endpoints.COURSES_ENDPOINT}${courses[0]._id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, TIME_OUT)

    //test endpoint post /
    test('A new Course can created',async () =>{
        let a = await api.post(endpoints.COURSES_ENDPOINT).send(
            {
                name:"Dummy Course",
                courseCode:"CSCC11",
                organizationId:orgs[0]._id
            }
        ).expect(201)
    },TIME_OUT)
    //test endpoint post / duplicate course
    test('A new Course cannot be created with duplicate id',async () =>{
        console.log(orgs[0]._id)
        let a = await api.post(endpoints.COURSES_ENDPOINT).send(
            {
                name:"Dummy Course 2 electric boogaloo",
                courseCode:"CSCC11",
                organizationId:orgs[0]._id
            }
        ).expect(400)
    },TIME_OUT)
    //test endpoint Delete /
    test('Our new course was deleted',async()=>{
        let c = await Course.findOne({courseCode:"CSCC11"}).exec();
        await api.delete(`${endpoints.COURSES_ENDPOINT}${c._id}`).expect(204)
    })

    //test endpoint PUT /:id
    test('Changin course name and code',async()=>{
        
        const res = await api.put(`${endpoints.COURSES_ENDPOINT}${courses[0]._id}`).send({
            name:"Advanced Database Organization",
            courseCode:"CSCD43"
        }).expect(200).expect('Content-Type', /application\/json/)
        
        expect(res.body['name']).toBe('Advanced Database Organization')
        expect(res.body.courseCode).toBe('CSCD43')
    })
    

    //test endpoint POST /addUsers/:id
    test('Add a student, ta, and instructor to a course',async()=>{
        
        let res = await api.put(`${endpoints.COURSES_ENDPOINT}add_users/${courses[0]._id}`).send({
            students:[users[0]],
            instructors:[users[2],users[0]]
        }).expect(200).expect('Content-Type', /application\/json/)
        expect(res.body.students.length == 1)
        expect(res.body.instructors.length == 2)
        let s = await Student.findById(users[0])
        let i = await Instructor.findById(users[2])
        expect(s.courses.length==1)
        expect(s.taCourses.length==1)
        expect(i.courses.length==1)

        //add again and try adding invalid users / students
         res = await api.put(`${endpoints.COURSES_ENDPOINT}add_users/${courses[0]._id}`).send({
            students:[users[0],users[1]],
            instructors:[users[0],users[2],users[1]]
        }).expect(200).expect('Content-Type', /application\/json/)
        expect(res.body.students.length == 1)
        expect(res.body.instructors.length == 2)
         s = await Student.findById(users[0])
         i = await Instructor.findById(users[2])
        expect(s.courses.length==1)
        expect(s.taCourses.length==1)
        expect(i.courses.length==1)

    })
    //test endpoint POST /removeUsers/:id
    test('Remove a student, ta, and instructor to a course',async()=>{
        
        const res = await api.put(`${endpoints.COURSES_ENDPOINT}remove_users/${courses[0]._id}`).send({
            students:[users[0]],
            instructors:[users[2],users[0]]
        }).expect(200).expect('Content-Type', /application\/json/)
        expect(res.body.students.length == 0)
        expect(res.body.instructors.length == 0)
        let s = await Student.findById(users[0])
        let i = await Instructor.findById(users[2])
        expect(s.courses.length==0)
        expect(s.taCourses.length==0)
        expect(i.courses.length==0)
    })
 

})

afterAll(async () => {
    await User.deleteMany({})
    await Organization.deleteMany({})
    await Course.deleteMany({})
    mongoose.connection.close()
})


