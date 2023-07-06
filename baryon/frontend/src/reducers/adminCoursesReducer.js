import { createSlice } from '@reduxjs/toolkit'
import { createNotification } from './notificationReducer'
import courseService from '../services/courseService'

const initialState = null

const adminCoursesSlice = createSlice({
    name: 'adminCourses',
    initialState,
    reducers: {
        setAdminCourses(state, action) {
            return action.payload
        },
    }
})

export const { setAdminCourses } = adminCoursesSlice.actions

export const getCoursesByOrgId = (id) => {
    return async dispatch => {
        try {
            const courses = await courseService.retrieveAllByOrgId(id)
            dispatch(setAdminCourses(courses))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export default adminCoursesSlice.reducer