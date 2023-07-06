import axios from 'axios'

// ! This is a generic class with GET, PUT, POST, DELETE functionality, if special functionality is needed
// ! it is best to extend this class and overwrite the methods
class GenericService {
    constructor(url) {
        this.url = url
    }

    async retrieve() {
        const res = await axios.get(`${this.url}`)
        return res.data
    }

    async retrieveSingle(id) {
        const res = await axios.get(`${this.url}${id}/`)
        return res.data
    }

    async create(obj) {
        const res = await axios.post(`${this.url}`, obj)
        return res.data
    }

    async update(obj) {
        const res = await axios.put(`${this.url}${obj.id}/`, obj)
        return res.data
    }

    async destroy(id) {
        const res = await axios.delete(`${this.url}${id}/`)
        return res.data
    }
}

export default GenericService
