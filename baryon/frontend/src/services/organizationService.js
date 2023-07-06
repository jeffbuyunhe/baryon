import axios from 'axios'

import { ENDPOINTS } from './endpoints'
import GenericService from './service'

const organizationService = new GenericService(ENDPOINTS.BASE_ORGANIZATION_URL)

// creates an organization
const create = async (obj) => {
    return organizationService.create(obj)
}

// gets an organization
const getOrg = async (id) => {
    return organizationService.retrieveSingle(id)
}

// updates an organization
const updateOrg = async (obj) => {
    return organizationService.update(obj)
}

// gets an organization by name
const getOrgByName = async (name) => {
    const res = await axios.get(`${ENDPOINTS.BASE_ORGANIZATION_URL}name/${name}`)
    return res.data
}

const organizationServices = {
    create,
    getOrg,
    updateOrg,
    getOrgByName
}

export default organizationServices