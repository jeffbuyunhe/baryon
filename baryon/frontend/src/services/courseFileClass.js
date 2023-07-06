import { ENDPOINTS } from './endpoints'
import GenericService from './service'
import axios from 'axios'

class CourseFileClass extends GenericService{

    constructor(url) {
        super(url)
        this.fileUrl = `${ENDPOINTS.BASE_COURSEFILE_URL}`
    }

    async retrieveSingleFile(id) {
        const res = await axios.get(`${this.fileUrl}${id}/`)
        return res.data
    }

    async uploadFiles(courseId, uploaderId, formData) {
        let headers = {
            courseId: courseId,
            uploaderId: uploaderId,
        }

        const form = new FormData()
        for(const file of formData){
            form.append('file', file)
        }
        try{
            const res = await axios.post(`${this.fileUrl}bulk`, form, {headers: headers})
            return res.data
        }catch(err){
            console.log(err)
        }

    }

    async deleteFile(id) {
        const res = await axios.delete(`${this.fileUrl}${id}/`)
        return res.data
    }

}

export default CourseFileClass