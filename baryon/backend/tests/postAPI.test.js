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
const { isCommentAuthor } = require('../utils/middleware')

const api = supertest(app)
const TIME_OUT = 10000

var commentSchema = new mongoose.Schema({}, { strict: false });

var comment = mongoose.model('Comment', commentSchema)


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
    title: 'Test1'
}

const forum2 = {
    title: 'Test2'
}

const post1 = {
    title: 'Hello World',
    content: "Hello Everyone!",
    comments: []
}

const post2 = {
    title: 'Hi',
    content: "Hello Everyone!"     
}

const comment2 = {
    content: "Hello!"
}

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockReturnValue((mailoptions, callback) => {})
    })
  }));

jest.mock('../utils/middleware', () => {

    const actualMiddleware = jest.requireActual('../utils/middleware')

    return {
        ...actualMiddleware,
        isCommentAuthor: (req, res, next) => {req.isAuthenticated = true; next()}
    }
    
})

beforeEach(async () => {
    await comment.deleteMany({})
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

    let comment1 = new comment({
        content: "nice to meet you!"
    })

    await comment1.save()

    let p = new comment({
       ...comment2
    })

    await p.save()

    comment2._id = p._id

    post1.comments.push(comment1._id, comment2._id)

    post1.author = initialIns._id

    let w = new post({
        ...post1
    })

    await w.save()

    post1._id = w._id

    post2.author = initialUser._id

    let l = new post({
        ...post2
    })

    await l.save()

    post2._id = l._id

    let x = new Forum({
        courseId: c._id,
        organizationId: org._id,
        ...forum1
    })

    x.posts.push(post1._id)
    x.posts.push(post2._id)

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
    test('All Posts and returned as JSON', async () => {

    const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
    .send({
        email: 'saad.makrod@mail.utoronto.ca',
        password: 'password123!'
    })

    const result = await api.get(endpoints.POST_ENDPOINT)
    .set('Authorization', `bearer ${res.body.token}`)
    .expect(200)
    
    expect(result.body).toHaveLength(2)
    
    },TIME_OUT)
    
    //test endpoint GET /:id
    test('A post can be found and is returned', async () => {

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

        await api.get(`${endpoints.POST_ENDPOINT}${post1._id}`)
            .set('Authorization', `bearer ${res.body.token}`)
            .expect(200)    
            .expect('Content-Type', /application\/json/)
    }, TIME_OUT)

    //test endpoint GET /:id nothing found
    test('Post id does not exist, Get by id', async () => {

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

        await api.get(`${endpoints.POST_ENDPOINT}faojfojfoefjkwaf`)
            .set('Authorization', `bearer ${res.body.token}`)
            .expect(400)    
            .expect('Content-Type', /application\/json/)
    }, TIME_OUT)

    //test endpoint post /
    test('A new post can created',async () =>{

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        await api.post(endpoints.POST_ENDPOINT).send(
            {
                courseid: initialCourse._id,
                forumId: forum1._id,
                title:"A2 Question",
                content: "I have a question about a2. ",
                author: initialUser._id
            }
        )
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(201)
    },TIME_OUT)

    //test endpoint post / duplicate forum
    test('A new post cannot be created with duplicate name of same forum',async () =>{
        
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

        await api.post(endpoints.POST_ENDPOINT).send(
            {
                title:"Hello World",
                content: "dup post",
                courseid: initialCourse._id,
                forumId: forum1._id,
                author: initialUser._id
            }
        )
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(400)
    },TIME_OUT)

    //test endpoint Delete /
    test('Our new Post was deleted',async()=>{

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        await api.delete(`${endpoints.POST_ENDPOINT}${post1._id}`)
        .send({
            courseid: initialCourse._id
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(204)
    })

    //test endpoint PUT /:id
    test('Changing post name',async()=>{
        
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        const result = await api.put(`${endpoints.POST_ENDPOINT}${post1._id}`)
        .send({
            title:"nvm...",
            forumId: forum1._id,
            courseid: initialCourse._id
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(result.body['title']).toBe('nvm...')
    })

    test('Changing post name but not author or instructor or admin',async()=>{
        
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@gmail.com',
            password: 'password123!'
        })
    
        const result = await api.put(`${endpoints.POST_ENDPOINT}${post1._id}`)
        .send({
            title:"nvm...",
            forumId: forum1._id,
            courseid: initialCourse._id
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(401)
        
    })

            //test endpoint post no title in req body
    test('A new post cannot be created with no title',async () =>{
        
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })

        await api.post(endpoints.POST_ENDPOINT).send(
            {
                content: "dup post",
                courseid: initialCourse._id,
                forumId: forum1._id,
                author: initialUser._id
            }
        )
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(400)
    },TIME_OUT)

    //test endpoint PUT /:id
    test('nothing is changed',async()=>{
        
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        const result = await api.put(`${endpoints.POST_ENDPOINT}${post1._id}`)
        .send({
            forumId: forum1._id,
            courseid: initialCourse._id
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(result.body['title']).toBe('Hello World')
        expect(result.body['content']).toBe('Hello Everyone!')
    })

    //test endpoint PUT addcomment /:id
    test('new comment is added',async()=>{
    
        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        const newComment = new mongoose.Types.ObjectId()

        const result = await api.put(`${endpoints.POST_ENDPOINT}add_comments/${post1._id}`)
        .send({
            courseid: initialCourse._id,
            comments: [
                newComment
            ]
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(result.body['comments']).toHaveLength(3)
    })

    //test endpoint PUT deletecomment /:id
    test('comment is deleted',async()=>{

        const res = await api.post(`${endpoints.USERS_ENDPOINT}login`)
        .send({
            email: 'saad.makrod@mail.utoronto.ca',
            password: 'password123!'
        })
    
        const result = await api.put(`${endpoints.POST_ENDPOINT}delete_comments/${post1._id}`)
        .send({
            courseid: initialCourse._id,
            comments: comment2._id
        })
        .set('Authorization', `bearer ${res.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(result.body['comments']).toHaveLength(1)
    })
 
})

afterEach(async () => {

    post1.comments = []

    await comment.deleteMany({})
    await User.deleteMany({})
    await Course.deleteMany({})
    await Student.deleteMany({})
    await Instructor.deleteMany({})
    await Organization.deleteMany({})
    await Forum.deleteMany({})
    await post.deleteMany({})
})

afterAll(async () => {
    mongoose.connection.close()
})

