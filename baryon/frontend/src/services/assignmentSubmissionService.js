import axios from 'axios'

import { ENDPOINTS } from './endpoints'

// create submission
const createSubmission = async (data) => {
    const res = await axios.post(`${ENDPOINTS.BASE_ASSIGNMENT_SUBMISSION_URL}`, data)
    return res.data
}

// get submission by assignment and student id
const getSubmissionByAssignmentStudentId = async (assignmentId, studentId) => {
    const res = await axios.get(`${ENDPOINTS.BASE_ASSIGNMENT_SUBMISSION_URL}${assignmentId}/${studentId}`)
    return res.data
}

const assignmentSubmissionServices = {
    createSubmission,
    getSubmissionByAssignmentStudentId,
}

export default assignmentSubmissionServices