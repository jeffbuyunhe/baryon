import courseService from '../services/courseService'
import { createSlice } from '@reduxjs/toolkit'

import { createNotification } from './notificationReducer'

const initialState = null

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCourses(state, action) {
            return action.payload
        },
        appendCourse(state, action){
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        destroyCourse(state, action){
            if (state === null) return state
            return state.filter(course => course.id !== action.payload)
        },
        changeCourse(state, action){
            if (state === null) return state
            return state.map(course => course.id === action.payload.id ? action.payload : course)
        }
    }
})

export const { setCourses, appendCourse, destroyCourse, changeCourse } = courseSlice.actions

export const createCourse = (data) => {
    return async dispatch => {
        try {
            const course = await courseService.create(data)
            dispatch(appendCourse(course))
            dispatch(createNotification('Course created', false))
        } catch {
            dispatch(createNotification('Course could not be created', true))
        }
    }
}

export const initializeCourses = () => {
    return async dispatch => {
        try {
            const courses = await courseService.retrieve()
            dispatch(setCourses(courses))
        } catch {
            dispatch(createNotification('Error retrieving courses', true))
        }
    }
}

export const getCourse = (id) => {
    return async dispatch => {
        try {
            const courses = await courseService.retrieveSingle(id)
            dispatch(appendCourse(courses))
        } catch {
            dispatch(createNotification('Error retrieving courses', true))
        }
    }
}

// get all courses given list of ids
export const getAllCoursesByIds = (ids) => {
    return async dispatch => {
        try {
            const courses = []
            for (let i = 0; i < ids.length; i++) {
                const course = await courseService.retrieveSingle(ids[i])
                if(course)
                courses.push(course)
            }
            dispatch(setCourses(courses))
        } catch {
            dispatch(createNotification('Error retrieving courses', true))
        }
    }
}

export const deleteCourse = (id) => {
    return async dispatch => {
        try {
            await courseService.destroy(id)
            dispatch(destroyCourse(id))
            dispatch(createNotification('Course deleted sucessfully', false))
        } catch {
            dispatch(createNotification('Error deleting course', true))
        }
    }
}


export const updateMaterial = (id, material) => {
    return async dispatch => {
        try {
            const course = await courseService.updateMaterial(id, material)
            dispatch(changeCourse(course))
            dispatch(createNotification('Course material updated', false))
        } catch {
            dispatch(createNotification('Error updating course material', true))
        }
    }
}

export const removeAllCourse = () =>{
    return async dispatch => {
        try {
            dispatch(setCourses(null))
        } catch {
            dispatch(createNotification('Error removing course', true))
        }
    }
}

export const updateCourse = (data) => {
    return async dispatch => {
        try {
            const course = await courseService.update(data)
            dispatch(changeCourse(course))
            dispatch(createNotification('Course updated successfully', false))
        } catch {
            dispatch(createNotification('Update of course failed', true))
        }
    }
}

export const updateLabels = (data) => {
    return async dispatch => {
        try {
            const course = await courseService.addLabel(data)
            dispatch(changeCourse(course))
            dispatch(createNotification('Course updated successfully', false))
        } catch {
            dispatch(createNotification('Update of course failed', true))
        }
    }
}

export default courseSlice.reducer