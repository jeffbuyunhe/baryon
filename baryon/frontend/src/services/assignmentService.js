import axios from 'axios'

import { ENDPOINTS } from './endpoints'

// get all by course id
const createAssignment = async (data) => {
    const res = await axios.post(`${ENDPOINTS.BASE_ASSIGNMENT_URL}`, data)
    return res.data
}

// get all by course id
const getAllByCourseId = async (courseId) => {
    const res = await axios.get(`${ENDPOINTS.BASE_ASSIGNMENT_URL}course/${courseId}`)
    return res.data
}

const assignmentServices = {
    createAssignment,
    getAllByCourseId,
}

export default assignmentServices