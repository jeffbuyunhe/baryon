// ! This file will contain the server endpoints

// The base url for all apis
const BASE_URL = 'http://localhost:3001/api/'

export const ENDPOINTS = {
    // temp endpoint to verify setup is working
    TEMP_URL: `${BASE_URL}notes/`,
    // The base url for user api
    BASE_USER_URL: `${BASE_URL}users/`,
    // The base url for organization api
    BASE_ORGANIZATION_URL: `${BASE_URL}organizations/`,
    // The base url for course api
    BASE_COURSE_URL: `${BASE_URL}courses/`,
    // The base url for student api
    BASE_STUDENT_URL: `${BASE_URL}students/`,
    // The base url for instructor api
    BASE_INSTRUCTOR_URL: `${BASE_URL}instructors/`,
    // The base url for registration api
    BASE_REGISTRATION_URL: `${BASE_URL}register/`,
    // The base url for course material api
    BASE_COURSEMATERIAL_URL: `${BASE_URL}materials/`,
    // The base url for course file api
    BASE_COURSEFILE_URL: `${BASE_URL}files/`,
    // The base url for assignment api
    BASE_ASSIGNMENT_URL: `${BASE_URL}assignment/`,
    // The base url for assignment submission api
    BASE_ASSIGNMENT_SUBMISSION_URL: `${BASE_URL}assignmentSubmission/`,
    // The base url for course file api
    BASE_COURSE_FILE_URL: `${BASE_URL}files/`,
    // the base url for annoucement api
    BASE_ANNOUCEMENT_URL: `${BASE_URL}announcements/`,
}
