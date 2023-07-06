import { createSlice } from '@reduxjs/toolkit'
import studentService from '../services/studentService'
import { createNotification } from './notificationReducer'

const initialState = null

const adminStudentsSlice = createSlice({
    name: 'adminStudents',
    initialState,
    reducers: {
        setAdminStudents(state, action) {
            return action.payload
        },
    }
})

export const { setAdminStudents } = adminStudentsSlice.actions

export const getStudentsByOrgId = (id) => {
    return async dispatch => {
        try {
            const students = await studentService.retrieveAllByOrgId(id)
            dispatch(setAdminStudents(students))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export default adminStudentsSlice.reducer