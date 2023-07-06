import axios from 'axios'
import { ENDPOINTS } from './endpoints'
import GenericService from './service'
import tokenService from './tokenService'

const annoucementService = new GenericService(ENDPOINTS.BASE_ANNOUCEMENT_URL)

const getCourseAnnoucement = async(courseId) =>{
    const res = await axios.get(`${ENDPOINTS.BASE_ANNOUCEMENT_URL}${courseId}`, tokenService.getAuthHeader())
    return res.data;
}

const create = async (obj, courseId) => {
    const res = await axios.post(`${ENDPOINTS.BASE_ANNOUCEMENT_URL}${courseId}`,
            obj,
            tokenService.getAuthHeader())
    return res.data
}

const annoucementServices = {
    create,
    getCourseAnnoucement,

}

export default annoucementServices