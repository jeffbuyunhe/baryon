import axios from 'axios'
import { ENDPOINTS } from './endpoints'
import tokenService from './tokenService'

// upload invite student csv file
const registerStudents = async (obj) => {
    const res = await axios.post(`${ENDPOINTS.BASE_REGISTRATION_URL}students`, obj, tokenService.getAuthHeader())
    return res.data
}

// upload invite student csv file
const registerFaculty = async (obj) => {
    const res = await axios.post(`${ENDPOINTS.BASE_REGISTRATION_URL}instructors`, obj, tokenService.getAuthHeader())
    return res.data
}

// upload invite student csv file
const addCourses = async (obj) => {
    const res = await axios.post(`${ENDPOINTS.BASE_REGISTRATION_URL}courses`, obj, tokenService.getAuthHeader())
    return res.data
}

// upload enroll students csv file
const enrollStudentsToCourse = async (courseId, obj) => {
    const res = await axios.post(`${ENDPOINTS.BASE_REGISTRATION_URL}course-students/${courseId}`, obj, tokenService.getAuthHeader())
    return res.data
}

// upload enroll instructors csv file
const enrollInstructorsToCourse = async (courseId, obj) => {
    const res = await axios.post(`${ENDPOINTS.BASE_REGISTRATION_URL}course-instructors/${courseId}`, obj, tokenService.getAuthHeader())
    return res.data
}

const registrationServices = {
    registerStudents,
    registerFaculty,
    addCourses,
    enrollStudentsToCourse,
    enrollInstructorsToCourse
}

export default registrationServices