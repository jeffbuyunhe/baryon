import { createSlice } from '@reduxjs/toolkit'
import { createNotification } from './notificationReducer'
import courseService from '../services/courseService'

const initialState = null

const adminManageCourseSlice = createSlice({
    name: 'adminManageCourse',
    initialState,
    reducers: {
        setAdminManageCourse(state, action) {
            return action.payload
        },
    }
})

export const { setAdminManageCourse } = adminManageCourseSlice.actions

export const getCourseByCourseId = (id) => {
    return async dispatch => {
        try {
            const course = await courseService.retrieveSingle(id)
            dispatch(setAdminManageCourse(course))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export default adminManageCourseSlice.reducer