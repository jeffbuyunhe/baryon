import { createSlice } from '@reduxjs/toolkit'

const initialState = null

// toolkit sets up the redux and state
const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action) {
            if(action.payload == null) return null

            return {
                error: action.payload.error,
                message: action.payload.message
            }
        }
    }
})

export const { setNotification } = notificationSlice.actions

export const createNotification = (message, error) => {
    return async dispatch => {
        if(message === null || error === null) {
            dispatch(setNotification(null))
        } else {
            dispatch(setNotification({
                message: message,
                error: error
            }))
        }
    }
}

export default notificationSlice.reducer