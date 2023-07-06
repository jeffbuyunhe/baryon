const userService = require('./userService')
const studentService = require('./studentService')
const instructorService = require('./instructorService')
const courseService = require('./courseService')
const User = require('../models/user')
const fs = require('fs')
const csv = require('fast-csv')

const registerStudents = async (file, u) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => reject(error))
            .on('data', async row => {
                const user = await userService.create({
                    ...row,
                    organizationId: u.organizationId
                }, null)

                if(user._id) await studentService.create(user._id, u)
            })
            .on('end', rowCount => resolve({
                created: rowCount
            }))
    })
}

const registerInstructors = async (file, u) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', async row => {
            const user = await userService.create({
                ...row,
                organizationId: u.organizationId
            }, null)

            if(user._id) await instructorService.create(user._id, u)
        })
        .on('end', rowCount => resolve({
            created: rowCount
        }))
    })
}

const registerCourses = async (file, u) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', async row => {
            await courseService.create({
                ...row,
                organizationId: u.organizationId
            })
        })
        .on('end', rowCount => resolve({
            created: rowCount
        }))
    })
}

const registerStudentsToCourse = async (file, course) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', async row => {
            const user = await User.findOne({email: row.email})

            if(user) await courseService.addUsers(course, {
                students: [user._id],
                instructors: []
            })
        })
        .on('end', rowCount => resolve({
            registered: rowCount
        }))
    })
}

const registerInstructorsToCourse = async (file, course) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', async row => {
            const user = await User.findOne({email: row.email})

            if(user) await courseService.addUsers(course, {
                instructors: [user._id],
                students: []
            })
        })
        .on('end', rowCount => resolve({
            registered: rowCount
        }))
    })
}

module.exports = {
    registerStudents,
    registerInstructors,
    registerCourses,
    registerStudentsToCourse,
    registerInstructorsToCourse
}