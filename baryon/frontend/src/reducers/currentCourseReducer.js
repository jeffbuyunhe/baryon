import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const currentCourseSlice = createSlice({
    name: 'currentCourse',
    initialState,
    reducers: {
        setCurrentCourse(state, action) {
            return action.payload
        },
    }
})

export const { setCurrentCourse } = currentCourseSlice.actions

export default currentCourseSlice.reducer