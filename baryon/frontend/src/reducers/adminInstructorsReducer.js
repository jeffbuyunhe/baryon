import { createSlice } from '@reduxjs/toolkit'
import { createNotification } from './notificationReducer'
import instructorService from '../services/instructorService'

const initialState = null

const adminInstructorsSlice = createSlice({
    name: 'adminInstructors',
    initialState,
    reducers: {
        setAdminInstructors(state, action) {
            return action.payload
        },
    }
})

export const { setAdminInstructors } = adminInstructorsSlice.actions

export const getInstructorsByOrgId = (id) => {
    return async dispatch => {
        try {
            const instructors = await instructorService.retrieveAllByOrgId(id)
            dispatch(setAdminInstructors(instructors))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export default adminInstructorsSlice.reducer