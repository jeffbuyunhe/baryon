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
let user1Id, user2Id;
let insturctorId;
let assignemnt_id;
beforeAll(async () => {
    await User.deleteMany({})
    await Course.deleteMany({})
    await Student.deleteMany({})
    await Instructor.deleteMany({})
    await Organization.deleteMany({})
    await CourseMaterial.deleteMany({})
    await Assignment.deleteMany({})

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

    test_files = new CourseFile({courseId: course_id})
    await test_files.save()
    course_file_id = test_files._id;
})

describe('Basic CRUD tests for Assignment', () => {
    test('A new assignment can created',async () =>{
        let new_assignment = await api.post(endpoints.ASSIGNMENT_ENDPOINT).send(
            {
                courseId: course_id,
                courseFileId: course_file_id,
                title: "Neo4j Graph Assignment",
                dueDate: Date.now(),
                weight: 0.2,
                totalMark: 80
            }
        ).expect(201)
        assignemnt_id = new_assignment.body.id
        
    },TIME_OUT)


    test('get all assignment from a course',async () =>{
        let existing_assignment = await api.get(`${endpoints.ASSIGNMENT_ENDPOINT}course/${course_id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },TIME_OUT)


    test('get all assignment of a student given student id',async () =>{
        let existing_assignment = await api.get(`${endpoints.ASSIGNMENT_ENDPOINT}student/${user1Id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },TIME_OUT)


    test("Get a specific student's all assignment for a specific course",async () =>{
        let existing_assignment = await api.get(`${endpoints.ASSIGNMENT_ENDPOINT}${user1Id}/${course_id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    },TIME_OUT)


    test("Update an assignment details (i.e. total marks dueDate and etc",async () =>{

        let updated_assignment = await api.post(`${endpoints.ASSIGNMENT_ENDPOINT}update`).send(
            {
                assignmentId: assignemnt_id,
                title: "Updated Neo4j Graph Assignment",
                dueDate: "2022-11-02T23:00:00",
                weight: 0.1,
                totalMark: 80
            }
        ).expect(201).expect('Content-Type', /application\/json/);
        expect(updated_assignment.body.title == "Updated Neo4j Graph Assignment")
        expect(updated_assignment.body.dueDate.toString() == "2022-11-02T23:00:00")
        expect(updated_assignment.body.weight == 0.1)
        expect(updated_assignment.body.totalMark == 80)
    },TIME_OUT)


    test("Delete a specific assignment in a specific course",async () =>{
         await api.post(`${endpoints.ASSIGNMENT_ENDPOINT}delete`).send(
            {
                assignmentId:assignemnt_id
            }
        ).expect(201)
    },TIME_OUT)



})
