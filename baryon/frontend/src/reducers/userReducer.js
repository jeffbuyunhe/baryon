import userService from '../services/userService'
import tokenService from '../services/tokenService'
import organizationService from '../services/organizationService'
import { createSlice } from '@reduxjs/toolkit'
import { setOrganization } from './organizationReducer'
import { createNotification } from './notificationReducer'

const initialState = null

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
    }
})

export const { setUser } = userSlice.actions

// creates an user
export const createUser = (isAdmin, organization, data) => {
    return async dispatch => {
        try {
            var org = await organizationService.getOrgByName(organization)
            if (!org) org = await organizationService.create({name: organization})
            data = { ...data, organizationId: org.id }
            if (isAdmin) data = { ...data, type: 'ADMIN'}
            const user = await userService.create(data)
            if (isAdmin) {
                org.admins.push(user.id)
                org = await organizationService.updateOrg(org)
            }
            dispatch(setUser({ ...user, signedUp: true }))
        } catch {
            dispatch(createNotification(
                'Sign up failed. Please contact us at support@baryon.com.', 
                true))
        }
    }
}

// login an user
export const login = (data) => {
    return async dispatch => { 
        try {
            const user = await userService.login(data)
            tokenService.setToken(user.token)
            dispatch(setUser({ ...user, loggedIn: true }))
        } catch {
            dispatch(createNotification(
                "Login failed, please try again.", 
                true))
        }
    }
}

// checks if a user is verified
export const verified = (email) => {
    return async dispatch => { 
        try {
            const user = await userService.userVerified(email)
            dispatch(setUser({ ...user, verified: user.verified }))
        } catch {
            dispatch(createNotification(
                "Cannot find the email in our record.", 
                true))
        }
    }
}

// activates an user
export const activate = (id, data) => {
    return async dispatch => { 
        try {
            const user = await userService.activateUser(id, data)
            dispatch(setUser({ ...user, activated: true }))
        } catch {
            dispatch(createNotification(
                "Cannot set up your account. Please contact us at support@baryon.com", 
                true))
        }
    }
}

// gets logged in user and organization
export const getUserAndOrganization = () => {
    return async dispatch => { 
        try {
            const user = await userService.getLoggedInUser()
            dispatch(setUser(user))
            const org = await organizationService.getOrg(user.organizationId)
            dispatch(setOrganization(org))
        } catch {
            dispatch(createNotification(
                "Session Expired.", 
                true))
        }
    }
}

export default userSlice.reducer