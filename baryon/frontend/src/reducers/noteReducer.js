import noteService from '../services/noteService'
import { createSlice } from '@reduxjs/toolkit'

import { createNotification } from './notificationReducer'

const initialState = null

const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setNotes(state, action) {
            return action.payload
        },
        appendNote(state, action){
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        destroyNote(state, action){
            if (state === null) return state
            return state.filter(note => note.id !== action.payload)
        },
        changeNote(state, action){
            if (state === null) return state
            return state.map(note => note.id === action.payload.id ? action.payload : note)
        }
    }
})

export const { setNotes, appendNote, destroyNote, changeNote } = noteSlice.actions

export const createNote = (data) => {
    return async dispatch => {
        try {
            const note = await noteService.create(data)
            dispatch(appendNote(note))
            dispatch(createNotification('Note created', false))
        } catch {
            dispatch(createNotification('Note could not be created', true))
        }
    }
}

export const initializeNotes = () => {
    return async dispatch => {
        try {
            const notes = await noteService.retrieve()
            dispatch(setNotes(notes))
        } catch {
            dispatch(createNotification('Error retrieving notes', true))
        }
    }
}

export const deleteNote = (id) => {
    return async dispatch => {
        try {
            await noteService.destroy(id)
            dispatch(destroyNote(id))
            dispatch(createNotification('Note deleted sucessfully', false))
        } catch {
            dispatch(createNotification('Error deleting note', true))
        }
    }
}

export const updateNote = (data) => {
    return async dispatch => {
        try {
            const note = await noteService.update(data)
            dispatch(changeNote(note))
            dispatch(createNotification('Note updated successfully', false))
        } catch {
            dispatch(createNotification('Update of note failed', true))
        }
    }
}

export default noteSlice.reducer