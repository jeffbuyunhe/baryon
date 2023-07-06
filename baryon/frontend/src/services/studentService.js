import axios from 'axios'

import { ENDPOINTS } from './endpoints'
import GenericService from './service'

const studentService = new GenericService(ENDPOINTS.BASE_STUDENT_URL)

const retrieve = async () => {
    return studentService.retrieve()
}

const retrieveSingle = async (id) => {
    return studentService.retrieveSingle(id)
}

const retrieveAllByOrgId = async (orgId) => {
    const res = await axios.get(`${ENDPOINTS.BASE_STUDENT_URL}organization/${orgId}`)
    return res.data
}

const create = async (obj) => {
    return studentService.create(obj)
}

const update = async (obj) => {
    return studentService.update(obj)
}

const destroy = async (id) => {
    return studentService.destroy(id)
}

const studentServices = {
    create,
    retrieve,
    retrieveSingle,
    retrieveAllByOrgId,
    update,
    destroy
}

export default studentServices