import axios from 'axios'

import { ENDPOINTS } from './endpoints'

// get course file by course file id
const createCrouseFile = async (file, courseId, instructorId) => {
    const config = {
        headers: {
            courseId: courseId,
            uploaderId: instructorId
    }}
    const res = await axios.post(`${ENDPOINTS.BASE_COURSE_FILE_URL}`, file, config)
    return res.data
}

// get course file by course file id
const getByCourseFileId = async (courseFileId) => {
    const res = await axios.get(`${ENDPOINTS.BASE_COURSE_FILE_URL}${courseFileId}`)
    return res.data
}

const courseFileServices = {
    createCrouseFile,
    getByCourseFileId
}

export default courseFileServices