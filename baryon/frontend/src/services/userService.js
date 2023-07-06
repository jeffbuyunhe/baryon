import axios from 'axios'

import { ENDPOINTS } from './endpoints'
import GenericService from './service'
import tokenService from './tokenService'

const userService = new GenericService(ENDPOINTS.BASE_USER_URL)

axios.defaults.baseURL = "/";

// admin sign up
const create = async (obj) => {
    return userService.create(obj)
}

// user log in
const login = async (obj) => {
    const res = await axios.post(`${ENDPOINTS.BASE_USER_URL}login`, obj)
    return res.data
}

// return whether user is verified or not
const userVerified = async (email) => {
    const res = await axios.get(`${ENDPOINTS.BASE_USER_URL}is-verified/${email}`)
    return res.data
}

// activates an user
const activateUser = async (id, obj) => {
    const res = await axios.post(`${ENDPOINTS.BASE_USER_URL}${id}/activate`, obj)
    return res.data
}

// get logged in user
const getLoggedInUser = async (obj) => {
    const res = await axios.get( `${ENDPOINTS.BASE_USER_URL}user/me`, tokenService.getAuthHeader())
    return res.data
}

const userServices = {
    create,
    login,
    userVerified,
    activateUser,
    getLoggedInUser
}

export default userServices