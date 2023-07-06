import React from 'react'
import './App.css'

import { Routes, Route, Outlet, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminSignup from './components/pages/AdminSignup/AdminSignup'
import AdminSignupSuccess from './components/pages/AdminSignup/AdminSignupSuccess'
import NotFound from './components/pages/NotFound'
import AdminHome from './components/pages/adminHomePage/AdminHomePage'
import HomePage from './components/pages/homePage/HomePage.js'
import LoginPage from './components/pages/userLoginPage/UserLoginPage.js'
import Grades from './components/pages/Grades/Grades.js'
import GradesInstructorMarkbook from './components/pages/Grades/GradesInstructorMarkbook/GradesInstructorMarkbook.js'
import AdminUploadPage from './components/pages/adminUploadPage/adminUploadPage'
import MediaPage from './components/pages/MediaPage/MediaPage'
import CourseHomePage from './components/pages/CourseHomePage/CourseHomePage'
import AdminManageCoursePage from './components/pages/adminUploadPage/adminManageCoursePage'
import AssignmentPage from './components/pages/AssignmentPage/AssignmentPage.js'
import Notification from './components/notifications/Notification'

import { getUserAndOrganization } from './reducers/userReducer';
import { getStudent } from './reducers/studentReducer'; 
import { getInstructor } from './reducers/instructorReducer'; 
import { getAllCoursesByIds } from './reducers/courseReducer';
import { getAllTaCoursesByIds } from './reducers/taCourseReducer'; 
import { setCurrentCourse } from './reducers/currentCourseReducer'

// ScrollToTop is a wrapper for the router to make the page go to the top when swapping to new component
// router used to do this for you weird that it doesn't anymore
import ScrollToTop from './components/navigation/ScrollToTop'

// Removes the trailing slash from url incase because some link tags have relative paths and it is good practice
import { RemoveTrailingSlash } from './components/navigation/RemoveTrailingSlash'
import { PAGES, COURSE } from './routes'
import { setAssignments } from './reducers/assignmentsReducer'

const App = () => {

    return (
        <div>
            <Notification />
            <ScrollToTop>
            <RemoveTrailingSlash />
                <Routes>
                    <Route path='*' element={<NotFound />} />
                    <Route path={PAGES.login.path} element={<LoginPage />} />
                    <Route path={PAGES.homePage.path} element={<HomePage/>} />
                    <Route path={PAGES.signup.path} element={<AdminSignup/>} />
                    <Route path={PAGES.signupsuccess.path} element={<AdminSignupSuccess/>} />
                    <Route path={PAGES.adminHome.path} element={<AdminHome />} />
                    <Route path={PAGES.adminUpload.path} element={<AdminUploadPage />} />
                    <Route path={PAGES.adminManageCourse.path} element={<AdminManageCoursePage />} />
                    <Route path={PAGES.courses.path} element={<VerifyEnrolment/>}>
                        <Route path='*' element={<NotFound />} />
                        <Route path={`:classCode${COURSE.home.path}`} element={<CourseHomePage />} />
                        <Route path={`:classCode${COURSE.grades.path}`} element={<Grades />} />
                        <Route path={`:classCode${COURSE.gradesAssignment.path}`} element={<GradesInstructorMarkbook />} />
                        <Route path={`:classCode${COURSE.studentAssignment.path}`} element={<AssignmentPage></AssignmentPage>}/>
                        <Route path={`:classCode${COURSE.media.path}`} element={<MediaPage/>} />
                    </Route>
                </Routes>
            </ScrollToTop>
        </div>
    )
}

const VerifyEnrolment = () => {
    const dispatch = useDispatch()

    const { classCode } = useParams();

    const user = useSelector(state => state.user)
    const courses = useSelector(state => state.course)
    const taCourses = useSelector(state => state.taCourse)
    const student = useSelector(state => state.student)
    const instructor = useSelector(state => state.instructor)
    const currentCourse = useSelector(state => state.currentCourse)

    useEffect(() => {
        dispatch(getUserAndOrganization())
    }, [dispatch]);

    useEffect(() => {
        if(user){
            dispatch(getStudent(user.id))
            dispatch(getInstructor(user.id))
        }
    }, [dispatch, user]);

    useEffect(() => {
        if(instructor)
            dispatch(getAllCoursesByIds(instructor.courses))
    }, [dispatch, instructor]);
    
    useEffect(() => {
        if(student){
            dispatch(getAllCoursesByIds(student.courses))
            dispatch(getAllTaCoursesByIds(student.taCourses))
        }
    }, [dispatch, student]);

    if(courses) {
        for(let i = 0; i < courses.length; i++) {
            if (courses[i].courseCode === classCode) {
                if(!currentCourse || classCode !== currentCourse.courseCode) {
                    dispatch(setCurrentCourse(courses[i]))
                    dispatch(setAssignments([]))
                }
                return (<Outlet />)
            }
        }
    }

    if(taCourses) {
        for(let i = 0; i < taCourses.length; i++) {
            if (taCourses[i].courseCode === classCode) {
                if(!currentCourse || taCourses[i].courseCode !== currentCourse.courseCode) {
                    dispatch(setCurrentCourse(taCourses[i]))
                    dispatch(setAssignments([]))
                }
                return (<Outlet />)
            }
        }
    }

    return (<NotFound />)
}

export default App

