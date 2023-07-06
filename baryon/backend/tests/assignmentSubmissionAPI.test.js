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
const Assignment = require('../models/assignment')
const AssignmentSubmission = require('../models/assignmentSubmission')
const api = supertest(app)
const TIME_OUT = 10000

const organization = [
    {
        name: 'University of Toronto',
        admins: [],
    }
]
const courses = 
    {
        name: 'Intro to Software Engineering',
        courseCode: 'CSCCC01',
    }
const users = [
    {
        email: 'saad.makrod@mail.utoronto.ca',
        firstname: 'Saad',
        lastname: 'Makrod',
    },
    {
        email: 'feilong.qiu@mail.utoronto.ca',
        firstname: 'jason',
        lastname: 'hyde',
    },
    {
        email: 'chrisqiu22@gmail.com',
        firstname:'Vassos',
        lastname:'Hadzilacos'
    }
]

let course_file_id;
let course_id;
let user1Id
let insturctorId;
let assignemnt_id;
let assignemntSubmission_id;
beforeAll(async () => {
    await User.deleteMany({})
    await Course.deleteMany({})
    await Student.deleteMany({})
    await Instructor.deleteMany({})
    await Organization.deleteMany({})
    await CourseMaterial.deleteMany({})
    await Assignment.deleteMany({})
    await AssignmentSubmission.deleteMany({})

    let test_org = new Organization(organization[0])
    await test_org.save()
    organization[0]._id = test_org._id;
        
    users[0].organizationId = organization[0]._id;
    let test_users = new User(users[0])
    await test_users.save()
    users[0]._id = test_users._id

    users[1].organizationId = organization[0]._id;
    test_users = new User(users[1])
    await test_users.save()
    users[1]._id = test_users._id

    users[2].organizationId = organization[0]._id;
    test_users = new User(users[2])
    await test_users.save()
    users[2]._id = test_users._id
    //student 1
    let test_students = new Student({_id: users[0]._id})
    await test_students.save()
    user1Id = users[0]._id;
    //student 2 
    /*
    test_students = new Student({_id: users[1]._id})
    await test_students.save()
    user1Id = users[1]._id;
    */
    //instructor
    let test_instructor = new Instructor({_id: users[2]._id})
    await test_instructor.save()
    insturctorId = users[2]._id;

    let test_courses = new Course({
        ...courses,
        organizationId: organization[0]._id,
        instructors: [
            insturctorId
        ],
        students: [
            user1Id,
        ]
    })

    const d = await test_courses.save()
    course_id = d._id

    test_instructor.courses.push(course_id)
    await test_instructor.save()

    test_students.courses.push(course_id)
    await test_students.save()

    let test_files = new CourseFile({courseId: course_id})
    await test_files.save()
    course_file_id = test_files._id;


    let test_assignment = new Assignment({
        courseId: course_id,
        courseFileId: course_file_id,
        title: "Neo4j Graph Assignment",
        dueDate: Date.now(),
        weight: 0.2,
        totalMark: 80
    })
    let new_assignment = await test_assignment.save();
    assignemnt_id = new_assignment._id;



})

describe('Basic CRUD tests for AssignmentSubmission', () => {
    test('A new assignmentSubmission can created',async () =>{
        let new_assignmentSubmission = await api.post(endpoints.ASSIGNMENTSUBMISSION_ENDPOINT).send(
            {
                assignmentId: assignemnt_id,
                studentId: user1Id,
                encodedFile : course_file_id
            }
        ).expect(201)
        assignemntSubmission_id = new_assignmentSubmission.body.id
        
    },TIME_OUT)


    test('get all assignmentSubmission',async () =>{
        await api.get(`${endpoints.ASSIGNMENTSUBMISSION_ENDPOINT}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },TIME_OUT)


    test('Get all assignmentSubmission of a student',async () =>{
        await api.get(`${endpoints.ASSIGNMENTSUBMISSION_ENDPOINT}student/${user1Id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },TIME_OUT)



    test("Get all assignmentSubmission within the course given the assignmentId",async () =>{
        await api.get(`${endpoints.ASSIGNMENTSUBMISSION_ENDPOINT}course/${course_id}/${assignemnt_id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },TIME_OUT)

    test("GET specific AssignmentSubmission",async () =>{
        await api.get(`${endpoints.ASSIGNMENTSUBMISSION_ENDPOINT}${assignemnt_id}/${user1Id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },TIME_OUT)


    test("Grade an assignment Submission given assignment id and student id",async () =>{

        let graded_assignment = await api.post(`${endpoints.ASSIGNMENTSUBMISSION_ENDPOINT}grade`).send(
            {
                assignmentId: assignemnt_id,
                studentId: user1Id,
                markObtained: 50, //be sure this is less or equal to max mark you can obtain
                feedback: "Excellent Work! Good job!"
            }
        ).expect(201).expect('Content-Type', /application\/json/);
        expect(graded_assignment.body.markObtained == 50)
        expect(graded_assignment.body.feedback == "Excellent Work! Good job!")

    },TIME_OUT)


    test("Grade an assignment Submission but exceed its max mark can obtained",async () =>{

        let graded_assignment = await api.post(`${endpoints.ASSIGNMENTSUBMISSION_ENDPOINT}grade`).send(
            {
                assignmentId: assignemnt_id,
                studentId: user1Id,
                markObtained: 100, //be sure this is less or equal to max mark you can obtain
                feedback: "Excellent Work! Good job!"
            }
        ).expect(400)


    },TIME_OUT)

})
