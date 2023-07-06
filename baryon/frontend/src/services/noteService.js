import { ENDPOINTS } from './endpoints'
import GenericService from './service'

const noteService = new GenericService(ENDPOINTS.TEMP_URL)

const retrieve = async () => {
    return noteService.retrieve()
}

const retrieveSingle = async (id) => {
    return noteService.retrieveSingle(id)
}

const create = async (obj) => {
    return noteService.create(obj)
}

const update = async (obj) => {
    return noteService.update(obj)
}

const destroy = async (id) => {
    return noteService.destroy(id)
}

export default { retrieve, retrieveSingle, create, update, destroy }