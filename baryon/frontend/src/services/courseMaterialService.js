import axios from 'axios'
import { ENDPOINTS } from './endpoints'
import CourseFileClass from './courseFileClass'

const courseMaterialService = new CourseFileClass(ENDPOINTS.BASE_COURSEMATERIAL_URL)

const retrieve = async () => {
    return courseMaterialService.retrieve()
}

const retrieveSingle = async (id) => {
    return courseMaterialService.retrieveSingle(id)
}

const retrieveAllByCourseId = async (courseId) => {

    const res = await axios.get(`${ENDPOINTS.BASE_COURSEMATERIAL_URL}get_by_courseid/${courseId}`)
    return res.data
}

const create = async (obj) => {
    return courseMaterialService.create(obj)
}

const update = async (obj) => {
    return courseMaterialService.update(obj)
}   

const destroy = async (id) => {
    return courseMaterialService.destroy(id)
}

const save = async (courseId, userId, formData) => {
    return courseMaterialService.uploadFiles(courseId, userId, formData)
}

const courseServices = {
    create,
    retrieve,
    retrieveSingle,
    retrieveAllByCourseId,
    update,
    save,
    destroy
}

export default courseServices