import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        setOrganization(state, action) {
            return action.payload
        },
    }
})

export const { setOrganization } = organizationSlice.actions

export default organizationSlice.reducer