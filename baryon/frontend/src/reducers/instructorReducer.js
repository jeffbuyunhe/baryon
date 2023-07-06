import instructorService from '../services/instructorService'
import { createSlice } from '@reduxjs/toolkit'

import { createNotification } from './notificationReducer'

const initialState = null

const instructorSlice = createSlice({
    name: 'instructors',
    initialState,
    reducers: {
        setInstructors(state, action) {
            return action.payload
        },
        setInstructor(state, action) {
            state.push(action.payload.id)
            return action.payload
        },
        appendInstructor(state, action){
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        destroyInstructor(state, action){
            if (state === null) return state
            return state.filter(instructor => instructor.id !== action.payload)
        },
        changeInstructor(state, action){
            if (state === null) return state
            return state.map(instructor => instructor.id === action.payload.id ? action.payload : instructor)
        }
    }
})

export const { setInstructors, setInstructor, appendInstructor, destroyInstructor, changeInstructor } = instructorSlice.actions

export const createInstructor = (data) => {
    return async dispatch => {
        try {
            const instructor = await instructorService.create(data)
            dispatch(appendInstructor(instructor))
            dispatch(createNotification('Instructor created', false))
        } catch {
            dispatch(createNotification('Instructor could not be created', true))
        }
    }
}


export const getInstructors = () => {
    return async dispatch => {
        try {
            const instructors = await instructorService.retrieve()
            dispatch(setInstructors(instructors))
        } catch {
            dispatch(createNotification('Error retrieving instructors', true))
        }
    }
}

export const getInstructor = (id) => {
    return async dispatch => {
        try {
            const instructor = await instructorService.retrieveSingle(id)
            dispatch(setInstructors(instructor))
        } catch {
            dispatch(createNotification('Error retrieving instructor', true))
        }
    }
}

export const deleteInstructor = (id) => {
    return async dispatch => {
        try {
            await instructorService.destroy(id)
            dispatch(destroyInstructor(id))
            dispatch(createNotification('Instructor deleted sucessfully', false))
        } catch {
            dispatch(createNotification('Error deleting instructor', true))
        }
    }
}

export const updateInstructor = (data) => {
    return async dispatch => {
        try {
            const instructor = await instructorService.update(data)
            dispatch(changeInstructor(instructor))
            dispatch(createNotification('Instructor updated successfully', false))
        } catch {
            dispatch(createNotification('Update of instructor failed', true))
        }
    }
}

export default instructorSlice.reducer