import './HomePage.css';
import Navbar from '../HomePageNav/Navbar.js';
import ClassList from './HomePageClassList/ClassList.js';
import NotificationList from '../NotificationColumn/NotificationList.js';
import HomePageTitle from '../homePageTitle/HomePageTitle';
import TAClassList from './HomePageClassList/TAClassList';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAndOrganization } from '../../../reducers/userReducer';
import { getStudent } from '../../../reducers/studentReducer';
import { getAllCoursesByIds } from '../../../reducers/courseReducer';
import { getAllTaCoursesByIds } from "../../../reducers/taCourseReducer";
import { getInstructor } from '../../../reducers/instructorReducer';
import { getCourseAnnoucement } from '../../../reducers/announcementReducer';

const HomePage = (props) =>{
    const dispatch = useDispatch()
    
    const user = useSelector(state => state.user)
    const student = useSelector(state => state.student)
    const instructor = useSelector(state => state.instructor)
    const courses = useSelector(state => state.course);

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

    useEffect(() =>{
        if(courses){
            dispatch(getCourseAnnoucement(courses[courses.length-1].id));
        }
    }, [courses]);

    return (
        <div className="student-home-page-layout">
            <Navbar></Navbar>
            <div>
                <HomePageTitle></HomePageTitle>
                <div className = "homepage-scrollable">
                    <ClassList></ClassList>
                    <TAClassList></TAClassList>
                </div>
            </div>
            <NotificationList isAdmin={user && user.isAdmin}></NotificationList>

        </div>
    );
}

export default HomePage;