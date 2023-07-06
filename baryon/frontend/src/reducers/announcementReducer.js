import annoucementService from '../services/annoucementService'
import { createSlice } from '@reduxjs/toolkit'

import { createNotification } from './notificationReducer'
import { useDispatch, useSelector } from 'react-redux';
import  instructorServices  from '../services/instructorService';

const initialState = null

const annoucementSlice = createSlice({
    name: 'annoucements',
    initialState,
    reducers: {
        setAnnoucements(state, action) {
            return action.payload
        },
        appendAnnoucement(state, action){
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        destroyAnnoucement(state, action){
            if (state === null) return state
            return state.filter(annoucement => annoucement.id !== action.payload)
        },
        changeAnnoucement(state, action){
            if (state === null) return state
            return state.map(annoucement => annoucement.id === action.payload.id ? action.payload : annoucement)
        }
    }
})

export const { setAnnoucements, appendAnnoucement, destroyAnnoucement, changeAnnoucement } = annoucementSlice.actions

export const createAnnoucement = (data, courseId) => {
    return async dispatch => {
        try {
            let annoucement = await annoucementService.create(data, courseId)
            const name = await instructorServices.retrieveSingle(annoucement.instructorId).then(result => result.id.firstname);
            annoucement = {...annoucement, instructorName: name};
            dispatch(appendAnnoucement(annoucement))
            dispatch(createNotification('Annoucement created', false))
        } catch {
            dispatch(createNotification('Annoucement could not be created', true))
        }
    }
}

export const getCourseAnnoucement = (courseId) =>{
    return async dispatch => {
        try {
            const annoucements = await annoucementService.getCourseAnnoucement(courseId)
            for (var i = 0; i< annoucements.length; i++){
                const name = await instructorServices.retrieveSingle(annoucements[i].instructorId).then(result => result.id.firstname);
                annoucements[i] = {...annoucements[i], instructorName: name};
                dispatch(appendAnnoucement(annoucements[i]))
            }
            
        } catch {
            dispatch(createNotification('Error retrieving annoucements', true))
        }
    }
}

export const removeAllAnnoucement = () =>{
    return async dispatch => {
        try {
            dispatch(setAnnoucements(null))
        } catch {
            dispatch(createNotification('Error removing annoucement', true))
        }
    }
}

export default annoucementSlice.reducer