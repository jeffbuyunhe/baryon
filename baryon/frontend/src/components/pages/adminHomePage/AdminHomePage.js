import './AdminHomePage.css'
import ManagementCard from './ManagementCard'
import StatsCard from './StatsCard'
import NotificationList from '../NotificationColumn/NotificationList'
import Navbar from '../HomePageNav/Navbar.js'
import HomePageTitle from '../homePageTitle/HomePageTitle'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAndOrganization } from '../../../reducers/userReducer'
import { getStudentsByOrgId } from "../../../reducers/adminStudentsReducer"
import { getInstructorsByOrgId } from "../../../reducers/adminInstructorsReducer"
import { getCoursesByOrgId } from "../../../reducers/adminCoursesReducer"

const AdminHome = () => {
    const dispatch = useDispatch()

    const org = useSelector(state => state.organization)
    const students = useSelector(state => state.adminStudents)
    const faculty = useSelector(state => state.adminInstructors)
    const courses = useSelector(state => state.adminCourses)
    const [statCards, setStatCards] = useState([])

    const courseIcon = require('./icons/course.png')
    const facultyIcon = require('./icons/faculty.png')
    const studentIcon = require('./icons/student.png')
    const postIcon = require('./icons/post.png')
    const managementCards = [
        {
            title: "Manage Courses",
            icon: courseIcon,
            redirectType: 'courses',
        },
        {
            title: "Manage Faculty",
            icon: facultyIcon,
            redirectType: 'faculty',
        },
        {
            title: "Manage Students",
            icon: studentIcon,
            redirectType: 'students',
        }]
    
    useEffect(() => {
        dispatch(getUserAndOrganization())
    }, [dispatch]);

    useEffect(() => {
        if (org && org.id) {
            dispatch(getStudentsByOrgId(org.id))
            dispatch(getInstructorsByOrgId(org.id))
            dispatch(getCoursesByOrgId(org.id))
        }
    }, [dispatch, org]);

    useEffect(() => {
        if (students && faculty && courses) {
            setStatCards([
                {
                    title: "Students",
                    icon: studentIcon,
                    stats: Object.keys(students).length
                },
                {
                    title: "Faculty",
                    icon: facultyIcon,
                    stats: Object.keys(faculty).length
                },
                {
                    title: "Courses",
                    icon: courseIcon,
                    stats: Object.keys(courses).length
                },
                {
                    title: "Discussion Posts",
                    icon: postIcon,
                    stats: "place-holder"
                }
            ])
        }
    }, [courseIcon, courses, dispatch, faculty, facultyIcon, org, postIcon, studentIcon, students]);

    return (
        <div className="admin-homepage-layout">
            <Navbar data={[]}></Navbar>
            <div>
                <HomePageTitle></HomePageTitle>
                <div className="admin-management-layout">
                    {managementCards.map(card =>
                        <ManagementCard
                            key={card.title} title={card.title} icon={card.icon} redirectType={card.redirectType}>
                        </ManagementCard>)}
                </div>
                 <div className="admin-stats-layout">
                    {statCards.map(card =>
                        <StatsCard
                            key={card.title} title={card.title} icon={card.icon} stats={card.stats}>
                        </StatsCard>)}
                </div>
            </div>
            <NotificationList isAdmin={true}></NotificationList>
        </div>
    )
}

export default AdminHome