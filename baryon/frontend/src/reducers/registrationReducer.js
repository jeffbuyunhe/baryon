import registrationService from "../services/registrationService"
import { createNotification } from "./notificationReducer"

export const uploadInviteStudentsCSV = (file) => {
    return async dispatch => {
        try {
            const res = await registrationService.registerStudents(file)
            dispatch(createNotification('Invited ' + res.created + ' students', false))
        } catch {
            dispatch(createNotification('Upload failed.', true))
        }
    }
}

export const uploadInviteFacultyCSV = (file) => {
    return async dispatch => {
        try {
            const res = await registrationService.registerFaculty(file)
            dispatch(createNotification('Invited ' + res.created + ' instructors', false))
        } catch {
            dispatch(createNotification('Upload failed.', true))
        }
    }
}

export const uploadAddCoursesCSV = (file) => {
    return async dispatch => {
        try {
            const res = await registrationService.addCourses(file)
            dispatch(createNotification('Created ' + res.created + ' courses', false))
        } catch {
            dispatch(createNotification('Upload failed.', true))
        }
    }
}

export const uploadEnrollStudentsCSV = (courseId, file) => {
    return async dispatch => {
        try {
            const res = await registrationService.enrollStudentsToCourse(courseId, file)
            dispatch(createNotification('Enrolled ' + res.registered + ' students', false))
        } catch {
            dispatch(createNotification('Upload failed.', true))
        }
    }
}

export const uploadEnrollInstructorsCSV = (courseId, file) => {
    return async dispatch => {
        try {
            const res = await registrationService.enrollInstructorsToCourse(courseId, file)
            dispatch(createNotification('Enrolled ' + res.registered + ' instructors', false))
        } catch {
            dispatch(createNotification('Upload failed.', true))
        }
    }
}