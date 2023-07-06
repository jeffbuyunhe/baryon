import React, {useState, useEffect} from 'react'

import { useSelector } from 'react-redux';

import { PAGES, COURSE } from '../../../routes'

import { useParams, useLocation, useNavigate } from 'react-router-dom'

import { Dropdown } from '../../pages/Dropdown/Dropdown';
import './CourseNavBar.css';

const CourseNavBar = () => {
    const navigate = useNavigate()

    const {classCode} = useParams()

    const course = useSelector(state => state.course)
    const taCourse = useSelector(state => state.taCourse)

    const location = useLocation()

    const [selected, setSelected] = useState('');

    const [chats, setChats] = useState([]);

    const onClickHome = () => {
        setSelected(COURSE.home.title)
        navigate(`${PAGES.courses.path}/${classCode}${COURSE.home.path}`)
    }

    const onClickAssignment = () => {
        setSelected(COURSE.studentAssignment.title)
        navigate(`${PAGES.courses.path}/${classCode}${COURSE.studentAssignment.path}`)
    }

    const onClickGrades = () => {
        setSelected(COURSE.grades.title)
        navigate(`${PAGES.courses.path}/${classCode}${COURSE.grades.path}`)
    }

    const onClickMedia = () => {
        setSelected(COURSE.media.title)
        navigate(`${PAGES.courses.path}/${classCode}${COURSE.media.path}`)
    }

    useEffect(() => {
        if(course){
            const found = course.find(courseObj => classCode === courseObj.courseCode)
            if(found)
                setChats(found.groupChats)
        }
        if(taCourse){
            const found = taCourse.find(courseObj => classCode === courseObj.courseCode)
            if(found)
                setChats(found.groupChats)
        }
    },[classCode, course, taCourse])

    // We check which course link is in the url and highlight the corresponding link    
    useEffect(() => {
        if(location.pathname.includes(`/${classCode}${COURSE.home.path}`)){
            setSelected(`${COURSE.home.title}`)
        }else if(location.pathname.includes(`/${classCode}${COURSE.studentAssignment.path}`)){
            setSelected(`${COURSE.studentAssignment.title}`)
        }else if(location.pathname.includes(`/${classCode}${COURSE.grades.path}`)){
            setSelected(`${COURSE.grades.title}`)
        }else {
            setSelected(`${COURSE.media.title}`)
        }
    },[location, classCode])

    return (
        <div className='course-navbar-layout'>
            <div className='course-name'>
                <div id='course-name-text'>{classCode ?  `${classCode.substring(0,6)}`:"Testing"}</div>
            </div>
            <div className='course-links'>
                <h2 className='course-nav-font' style={{background: (selected === `${COURSE.home.title}` ? '' : 'transparent')}} onClick={onClickHome}>
                        {COURSE.home.title}
                </h2>
                <h2 className='course-nav-font' style={{background: (selected === `${COURSE.studentAssignment.title}` ? '' : 'transparent')}} onClick={onClickAssignment}>
                    {COURSE.studentAssignment.title}
                </h2>
                <h2 className='course-nav-font' style={{background: (selected ===  `${COURSE.grades.title}` ? '' : 'transparent')}} onClick={onClickGrades}>
                        {COURSE.grades.title}
                </h2>
                <h2 className='course-nav-font' style={{background: (selected ===  `${COURSE.media.title}` ? '' : 'transparent')}} onClick={onClickMedia} >
                        {COURSE.media.title}
                </h2>
            </div>
            <div className='course-channels'>
                <h1 id='course-channel-header'>Channels</h1>
                    <Dropdown 
                        title="Section 01"
                        data={[
                            <a href='#general' id="general">#general</a>,
                            ...chats
                        ]}
                    />
            </div>
        </div>
    )
}

export default CourseNavBar