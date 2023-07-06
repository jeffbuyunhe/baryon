// ! This file contains the redux store used across the app
import { configureStore } from '@reduxjs/toolkit'
import courseReducer from './reducers/courseReducer'
import studentReducer from './reducers/studentReducer'

import noteReducer from './reducers/noteReducer'
import notificationReducer from './reducers/notificationReducer'
import organizationReducer from './reducers/organizationReducer'
import userReducer from './reducers/userReducer'
import instructorReducer from './reducers/instructorReducer'
import adminStudentsReducer from './reducers/adminStudentsReducer'
import adminInstructorsReducer from './reducers/adminInstructorsReducer'
import adminCoursesReducer from './reducers/adminCoursesReducer'
import adminManageCourseReducer from './reducers/adminManageCourseReducer'
import taCourseReducer from './reducers/taCourseReducer'
import courseMaterialReducer from './reducers/courseMaterialReducer'
import assignmentsReducer from './reducers/assignmentsReducer'
import currentCourseReducer from './reducers/currentCourseReducer'
import announcementReducer from './reducers/announcementReducer'

// create store for redux
const store = configureStore({
    reducer: {
        notification: notificationReducer,
        notes: noteReducer,
        user: userReducer,
        organization: organizationReducer,
        course: courseReducer,
        student: studentReducer,
        instructor: instructorReducer,
        adminStudents: adminStudentsReducer,
        adminInstructors: adminInstructorsReducer,
        adminCourses: adminCoursesReducer,
        adminManageCourse: adminManageCourseReducer,
        taCourse: taCourseReducer,
        courseMaterial: courseMaterialReducer,
        assignments: assignmentsReducer,
        currentCourse: currentCourseReducer,
        announcement: announcementReducer,
    }
})

export default store