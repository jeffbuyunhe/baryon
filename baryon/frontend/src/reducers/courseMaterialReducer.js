import courseMaterialService from '../services/courseMaterialService'
import { createSlice } from '@reduxjs/toolkit'

import { createNotification } from './notificationReducer'

const initialState = null

const courseMaterialSlice = createSlice({
    name: 'courseMaterial',
    initialState,
    reducers: {
        setCourseMaterial(state, action) {
            return action.payload
        },
        appendCourseMaterial(state, action){
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        appendManyCourseMaterial(state, action){
            if (state == null ) return [action.payload]
            state.push(...action.payload)
        }
    }
})

export const { setCourseMaterial, appendCourseMaterial, appendManyCourseMaterial } = courseMaterialSlice.actions

export const createCourseMaterial = (data) => {
    return async dispatch => {
        try {
            const courseMaterial = await courseMaterialService.create(data)
            dispatch(appendCourseMaterial(courseMaterial))
            dispatch(createNotification('Course material created', false))
        } catch {
            dispatch(createNotification('Course material could not be created', true))
        }
    }
}

export const initializeCourseMaterial = () => {
    return async dispatch => {
        try {
            const courseMaterials = await courseMaterialService.retrieve()
            dispatch(setCourseMaterial(courseMaterials))
        } catch {
            dispatch(createNotification('Error retrieving course material', true))
        }
    }
}

export const setAllCourseMaterialByCourseId = (id) => {
    return async dispatch => {
        try {
            const courseMaterials = await courseMaterialService.retrieveAllByCourseId(id)
            dispatch(setCourseMaterial(courseMaterials))
        } catch {
            dispatch(createNotification('Error retrieving course material', true))
        }
    }
}

export const getCourseMaterial = (id) => {
    return async dispatch => {
        try {
            const courseMaterials = await courseMaterialService.retrieveSingle(id)
            dispatch(appendCourseMaterial(courseMaterials))
        } catch {
            dispatch(createNotification('Error retrieving course material', true))
        }
    }
}

export const saveCourseMaterial = (courseId, uploaderId, formData, label) => {
    return async dispatch => {
        try{
            const files = await courseMaterialService.save(courseId, uploaderId, formData)
            let filesToAdd = []
            for(var file of files){
                let obj = {
                    label: label,
                    courseFileId: file.id,
                    title: file.filename,
                    courseId: courseId
                }
                const courseMaterial = await courseMaterialService.create(obj)
               filesToAdd.push(courseMaterial)
            }
            dispatch(appendManyCourseMaterial(filesToAdd))
            dispatch(createNotification('Course materials Created', false))
        } catch {
            dispatch(createNotification('Error retrieving course material', true))
        }
    }
}

export const downloadCourseMaterial = async (id) => {
    return await courseMaterialService.downloadFile(id);
}

export default courseMaterialSlice.reducer