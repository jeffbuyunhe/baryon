const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const endpoints = require('../utils/endpoints')
const User = require('../models/user')
const Student = require('../models/student')
const Instructor = require('../models/instructor')
const Organization = require('../models/organization')
const Course = require('../models/course')
const Forum = require('../models/discussionBoard')
const post = require('../models/post')

const api = supertest(app)
const TIME_OUT = 10000

const initialUser = {
    email: 'saad.makrod@gmail.com',
    firstname: 'Saad',
    lastname: 'Makrod',
    password: 'password123!',
    isAdmin: false  
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

const forum1 = {
    title: 'Test1',
    posts: []
}

const forum2 = {
    title: 'Test2'
}

const post1 = {
    title: 'Hello World',
    content: "Hello Everyone!"
}

const post2 = {
    title: 'Hi',
    content: "Hello Everyone!"     
}


jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockReturnValue((mailoptions, callback) => {})
    })
  }));

beforeEach(async () => {
    await User.deleteMany({})
    await Organization.deleteMany({})
    await Course.deleteMany({})
    await Instructor.deleteMany({})
    await Forum.deleteMany({})
    await post.deleteMany({})

    let org = new Organization({
        ...initialOrg,
    })
    await org.save()

    initialOrg._id = org._id

    let u = await api.post(endpoints.USERS_ENDPOINT).send({
        ...initialUser,
        organizationId: org._id
    })

    initialUser._id = u.body.id

    org.admins.push(u.body.id)
    org.save()

    let u2 = await User.findById(u.body.id)
    u2.organizationId = org._id
    await u2.save()

    let i = await api.post(endpoints.USERS_ENDPOINT).send({
        ...initialIns,
        organizationId: org._id
    })

    initialIns._id = i.body.id

    let ins = new Instructor({
        _id: i.body.id
    })

    await ins.save()

    let c = new Course({
        ...initialCourse,
        organizationId: org._id,
        instructors: [
            ins._id
        ]
    })
    await c.save()

    ins.courses.push(c._id)
    await ins.save()

    initialCourse._id = c._id

    post1.author = initialIns._id

    let q = new post({
        ...post1
    })

    await q.save()

    post1._id = q._id

    let s = new post({
        ...post2
    })

    await s.save()

    post2._id = s._id

    forum1.posts.push(q._id)

    let x = new Forum({
        courseId: c._id,
        organizationId: org._id,
        ...forum1
    })

    await x.save()

    let y = new Forum({
        courseId: c._id,
        organizationId: org._id,
        ...forum2
    })

    await y.save()

    forum1._id = x._id

    forum2._id = y._id  

}, TIME_OUT*3)

describe('Basic CRUD tests', () => {

    //test endpoint GET /
    test('All Forums and returned as JSON', async () => {

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
    .send({
        email: 'saad.makrod@mail.utoronto.ca',
        password: 'password123!'
    })

    const result = await api.get(endpoints.DISCUSSIONBOARD_ENDPOINT)
    .set('Authorization', `bearer ${res.body.token}`)
    .expect(200)
    
    expect(result.body).toHaveLength(2)
    
    },TIME_OUT)
    
    //test endpoint GET /:id
    test('A Forum can be found and is returned', async () => {

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

        await api.get(`${endpoints.DISCUSSIONBOARD_ENDPOINT}${forum1._id}`)
            .send({
                courseid: initialCourse._id
            })
            .set('Authorization', `bearer ${res.body.token}`)
            .expect(200)    
            .expect('Content-Type', /application\/json/)
    }, TIME_OUT)

    //test endpoint post /
    test('A new Forum can created',async () =>{

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        await api.post(endpoints.DISCUSSIONBOARD_ENDPOINT).send(
            {
                title:"Test3",
                courseid: initialCourse._id,
                organizationId: initialOrg._id
            }
        )
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(201)
    },TIME_OUT)

    //test endpoint post / duplicate forum
    test('A new Forum cannot be created with duplicate name',async () =>{
        
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

        await api.post(endpoints.DISCUSSIONBOARD_ENDPOINT).send(
            {
                title:"Test1",
                courseid: initialCourse._id,
                organizationId: initialOrg._id
            }
        )
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(400)
    },TIME_OUT)

    //test endpoint Delete /
    test('Our new forum was deleted',async()=>{

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        let c = await Forum.findOne({title:"Test3"}).exec();
        await api.delete(`${endpoints.DISCUSSIONBOARD_ENDPOINT}${forum1._id}`)
        .send({
            courseid: initialCourse._id
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(204)
    })

    //test endpoint PUT /:id
    test('Changing Forum name',async()=>{
        
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        const result = await api.put(`${endpoints.DISCUSSIONBOARD_ENDPOINT}${forum1._id}`)
        .send({
            title:"Test5",
            courseid: initialCourse._id
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(result.body['title']).toBe('Test5')
    })

    //test endpoint PUT /add_posts/:id
    test('add post to forum',async()=>{
    
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        const result = await api.put(`${endpoints.DISCUSSIONBOARD_ENDPOINT}add_posts/${forum1._id}`)
        .send({
            posts: [post2._id],
            courseid: initialCourse._id,
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(result.body['posts']).toHaveLength(2)
    })

    //test endpoint PUT /delete_posts/:id
    test('delete post from forum',async()=>{

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        const result = await api.put(`${endpoints.DISCUSSIONBOARD_ENDPOINT}delete_posts/${forum1._id}`)
        .send({
            postId: post1._id,
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(result.body['posts']).toHaveLength(0)
    })
    
})

afterEach(async () => {

    forum1.posts = []

    await post.deleteMany({})
    await User.deleteMany({})
    await Course.deleteMany({})
    await Student.deleteMany({})
    await Instructor.deleteMany({})
    await Organization.deleteMany({})
    await Forum.deleteMany({})
})

afterAll(async () => {
    mongoose.connection.close()
})

