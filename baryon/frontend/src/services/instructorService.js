import { ENDPOINTS } from './endpoints'
import GenericService from './service'
import axios from 'axios'

const instructorService = new GenericService(ENDPOINTS.BASE_INSTRUCTOR_URL)

const retrieve = async () => {
    return instructorService.retrieve()
}

const retrieveSingle = async (id) => {
    return instructorService.retrieveSingle(id)
}

const create = async (obj) => {
    return instructorService.create(obj)
}

const update = async (obj) => {
    return instructorService.update(obj)
}

const destroy = async (id) => {
    return instructorService.destroy(id)
}

const retrieveAllByOrgId = async (orgId) => {
    const res = await axios.get(`${ENDPOINTS.BASE_INSTRUCTOR_URL}organization/${orgId}`)
    return res.data
}

const instructorServices = {
    create,
    retrieve,
    retrieveSingle,
    update,
    destroy,
    retrieveAllByOrgId,
}

export default instructorServices