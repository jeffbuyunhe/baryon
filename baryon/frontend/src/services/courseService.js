import axios from 'axios'
import { ENDPOINTS } from './endpoints'
import GenericService from './service'
import tokenService from './tokenService'

const courseService = new GenericService(ENDPOINTS.BASE_COURSE_URL)

const retrieve = async () => {
    return courseService.retrieve()
}

const retrieveSingle = async (id) => {
    return courseService.retrieveSingle(id)
}

const retrieveAllByOrgId = async (orgId) => {
    const res = await axios.get(`${ENDPOINTS.BASE_COURSE_URL}organization/${orgId}`)
    return res.data
}

const addLabel = async (obj) => {
    const authHeader = tokenService.getAuthHeader();
    const res = await axios.put(`${courseService.url}add_label/${obj.id}`, obj, authHeader)
    return res.data
}

const create = async (obj) => {
    return courseService.create(obj)
}

const update = async (obj) => {
    return courseService.update(obj)
}

const destroy = async (id) => {
    return courseService.destroy(id)
}

const courseServices = {
    create,
    retrieve,
    retrieveSingle,
    retrieveAllByOrgId,
    update,
    addLabel,
    destroy
}

export default courseServices