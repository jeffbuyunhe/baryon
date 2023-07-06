import courseService from '../services/courseService'
import { createSlice } from '@reduxjs/toolkit'

import { createNotification } from './notificationReducer'

const initialState = null

const taCourseSlice = createSlice({
    name: 'taCourse',
    initialState,
    reducers: {
        setTaCourse(state, action) {
            return action.payload
        },
        appendTaCourse(state, action){
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        destroyTaCourse(state, action){
            if (state === null) return state
            return state.filter(course => course.id !== action.payload)
        },
        changeTaCourse(state, action){
            if (state === null) return state
            return state.map(course => course.id === action.payload.id ? action.payload : course)
        }
    }
})

export const { setTaCourse, appendTaCourse, destroyTaCourse, changeTaCourse } = taCourseSlice.actions

export const createTaCourse = (data) => {
    return async dispatch => {
        try {
            const course = await courseService.create(data)
            dispatch(appendTaCourse(course))
            dispatch(createNotification('Course created', false))
        } catch {
            
            dispatch(createNotification('Course could not be created', true))
        }
    }
}

export const initializeTaCourses = () => {
    return async dispatch => {
        try {
            const courses = await courseService.retrieve()
            dispatch(setTaCourse(courses))
        } catch {
            dispatch(createNotification('Error retrieving courses', true))
        }
    }
}

export const getTaCourse = (id) => {
    return async dispatch => {
        try {
            const courses = await courseService.retrieveSingle(id)
            dispatch(appendTaCourse(courses))
        } catch {
            dispatch(createNotification('Error retrieving TA courses', true))
        }
    }
}

export const getAllTaCoursesByIds = (ids) => {
    return async dispatch => {
        try {
            const taCourses = []
            for (let i = 0; i < ids.length; i++) {
                const course = await courseService.retrieveSingle(ids[i])
                if(course)
                    taCourses.push(course)
            }
            dispatch(setTaCourse(taCourses))
        } catch {
            dispatch(createNotification('Error retrieving TA courses', true))
        }
    }
}


export const deleteTaCourse = (id) => {
    return async dispatch => {
        try {
            await courseService.destroy(id)
            dispatch(destroyTaCourse(id))
            dispatch(createNotification('Course deleted sucessfully', false))
        } catch {
            dispatch(createNotification('Error deleting course', true))
        }
    }
}

export const removeAllCourse = () =>{
    return async dispatch => {
        try {
            dispatch(setTaCourse(null))
        } catch {
            dispatch(createNotification('Error removing course', true))
        }
    }
}

export const updateCourse = (data) => {
    return async dispatch => {
        try {
            const course = await courseService.update(data)
            dispatch(changeTaCourse(course))
            dispatch(createNotification('Course updated successfully', false))
        } catch {
            dispatch(createNotification('Update of course failed', true))
        }
    }
}

export default taCourseSlice.reducer