import { createSlice } from '@reduxjs/toolkit'

import assignmentService from '../services/assignmentService'
import assignmentSubmissionService from '../services/assignmentSubmissionService'
import courseFileService from '../services/courseFileService'
import { createNotification } from './notificationReducer'

const initialState = null

const assignmentsSlice = createSlice({
    name: 'assignments',
    initialState,
    reducers: {
        setAssignments(state, action) {
            return action.payload
        },
        appendAssignment(state, action) {
            if (state === null) return [action.payload]
            state.push(action.payload)
        },
        editSubmissionDate(state, action) {
            for (let i = 0; i < state.length; i++) {
                if(state[i].id === action.payload.assignmentId)
                    state[i].submissionDate = action.payload.submissionDate
            }
        }
    }
})

export const { setAssignments, appendAssignment, editSubmissionDate } = assignmentsSlice.actions

export const getAssignmentsByCourseIdForStudents = (courseId, studentId) => {
    return async dispatch => {
        try {
            const assignments = await assignmentService.getAllByCourseId(courseId)
            for (let i = 0; i < assignments.length; i++) {
                // get assignment filename
                const courseFile = await courseFileService.
                        getByCourseFileId(assignments[i].courseFileId)
                // get submission if any
                const submission = await assignmentSubmissionService.
                        getSubmissionByAssignmentStudentId(assignments[i].id, studentId)
                assignments[i] = {
                    ...assignments[i],
                    filename: courseFile ? courseFile.filename : '',
                    fileId: courseFile ? courseFile.id : '',
                    submissionDate: submission ? submission.submissionDate : null
                }
            }
            dispatch(setAssignments(assignments))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export const getAssignmentsByCourseIdForInstructor = (courseId, instructorId) => {
    return async dispatch => {
        try {
            const assignments = await assignmentService.getAllByCourseId(courseId)
            for (let i = 0; i < assignments.length; i++) {
                const courseFile = await courseFileService.
                        getByCourseFileId(assignments[i].courseFileId)
                assignments[i] = {
                    ...assignments[i],
                    filename: courseFile ? courseFile.filename : '',
                    fileId: courseFile ? courseFile.id : '',
                }
            }
            dispatch(setAssignments(assignments))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export const createAssignment = (assignmentPayload, file, courseId, uploaderId) => {
    return async dispatch => {
        try {
            // upload file
            const courseFile = await courseFileService.createCrouseFile(file, courseId, uploaderId)
            // get course file id and create assignment payload
            assignmentPayload = { ...assignmentPayload, courseId:courseId, courseFileId: courseFile.id }
            const assignment = await assignmentService.createAssignment(assignmentPayload)
            dispatch(appendAssignment({ ...assignment, filename:courseFile.filename, fileId:courseFile.id }))         
            dispatch(createNotification('Successfully created.', false))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export const submitAssignment = (courseId, assignmentId, uploaderId, file) => {
    return async dispatch => {
        try {
            // upload file
            const courseFile = await courseFileService.createCrouseFile(file, courseId, uploaderId)
            // get course file id and create assignment payload
            const submissionPayload = { assignmentId:assignmentId, studentId:uploaderId, encodedFile:courseFile.id }
            const submission = await assignmentSubmissionService.createSubmission(submissionPayload)
            dispatch(editSubmissionDate({ assignmentId:assignmentId, submissionDate:submission.submissionDate }))         
            dispatch(createNotification('Successfully submitted.', false))
        } catch {
            dispatch(createNotification('Something went wrong.', true))
        }
    }
}

export default assignmentsSlice.reducer