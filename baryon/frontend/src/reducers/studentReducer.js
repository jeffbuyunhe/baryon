import studentService from '../services/studentService'
import { createSlice } from '@reduxjs/toolkit'

import { createNotification } from './notificationReducer'

const initialState = null

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setStudents(state, action) {
            return action.payload
        },
        setStudent(state, action) {
            state.push(action.payload)
            return action.payload
        },
        appendStudent(state, action){
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        destroyStudent(state, action){
            if (state === null) return state
            return state.filter(student => student.id !== action.payload)
        },
        changeStudent(state, action){
            if (state === null) return state
            return state.map(student => student.id === action.payload.id ? action.payload : student)
        }
    }
})

export const { setStudents, appendStudent, destroyStudent, changeStudent } = studentSlice.actions

export const createStudent = (data) => {
    return async dispatch => {
        try {
            const student = await studentService.create(data)
            dispatch(appendStudent(student))
            dispatch(createNotification('Student created', false))
        } catch {
            dispatch(createNotification('Student could not be created', true))
        }
    }
}

export const initializeStudents = () => {
    return async dispatch => {
        try {
            const students = await studentService.retrieve()
            dispatch(setStudents(students))
        } catch {
            dispatch(createNotification('Error retrieving students', true))
        }
    }
}

export const getStudent = (id) => {
    return async dispatch => {
        try {
            const student = await studentService.retrieveSingle(id)
            dispatch(setStudents(student))
        } catch {
            dispatch(createNotification('Error retrieving students', true))
        }
    }
}

export const deleteStudent = (id) => {
    return async dispatch => {
        try {
            await studentService.destroy(id)
            dispatch(destroyStudent(id))
            dispatch(createNotification('Student deleted sucessfully', false))
        } catch {
            dispatch(createNotification('Error deleting student', true))
        }
    }
}

export const updateStudent = (data) => {
    return async dispatch => {
        try {
            const student = await studentService.update(data)
            dispatch(changeStudent(student))
            dispatch(createNotification('Student updated successfully', false))
        } catch {
            dispatch(createNotification('Update of student failed', true))
        }
    }
}

export default studentSlice.reducer