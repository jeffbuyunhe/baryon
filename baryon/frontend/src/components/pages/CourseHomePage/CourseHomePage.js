import {useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom'

import './CourseHomePage.css';
import Navbar from '../HomePageNav/Navbar.js';
import CourseNavBar from '../../navigation/CourseNavBar/CourseNavBar.js';
import { CourseHomeDropdown } from './CourseHomeDropdown/CourseHomeDropdown';
import { MdPostAdd } from "react-icons/md";
import { FaCaretUp } from "react-icons/fa"
import { HiCheck } from "react-icons/hi"
import { createNotification } from "../../../reducers/notificationReducer";
import { setInstructor } from "../../../reducers/instructorReducer";
import { updateLabels } from "../../../reducers/courseReducer"
import {setAllCourseMaterialByCourseId} from '../../../reducers/courseMaterialReducer'

const CourseHomePage = () => {

    const dispatch = useDispatch()
    const {classCode} = useParams();
    
    const instructor = useSelector(state => state.instructor)
    const course = useSelector(state => state.course)
    const student = useSelector(state => state.student)
    
    const [currentCourse, setCurrentCourse] = useState(null);
    const [create, setCreate] = useState(false);
    const [isInstructor, setIsInstructor] = useState(false);
    const [labels, setLabels] = useState([]);
    const [labelTitle, setLabelTitle] = useState('');

    const addLabel = () => {
        let newLabels = labels;

        if(labelTitle && labelTitle.trim()) {

            const thisCourse = JSON.parse(JSON.stringify(currentCourse));

            if(thisCourse.labels.some(x => x === labelTitle.trim())) {
                dispatch(createNotification("Label with same title already exists.", true))
                return
            }

            newLabels.push({title: labelTitle})
            setLabels(newLabels)
            setCreate(!create)  
            setLabelTitle('')
            dispatch(updateLabels({id: thisCourse.id, label: labelTitle}))
        }
    }

    useEffect(() => {
        if(instructor){
            setIsInstructor(true)
        }else{
            setInstructor(false)
        }
    }, [dispatch, instructor]);
    
    useEffect(() => {
        if(course){
            setCurrentCourse(course.find(x => x.courseCode === classCode))
        }

    },[course, classCode])

    useEffect(() => {
        if(currentCourse && labels.length < 1){
            const material = currentCourse.labels.map(x => ({title: x}))
            setLabels(material)
            dispatch(setAllCourseMaterialByCourseId(currentCourse.id))
        }
    },[currentCourse, labels.length])   

    return (
        <div className='course-homepage-layout' >
            <Navbar data={[]}/>
            <CourseNavBar />
            <div className='course-items-layout'>
                <div className="labels">
                    {labels.map(label => (
                        <CourseHomeDropdown
                        borderColor="#ACACAC"
                        title={label.title}
                        isInstructor={isInstructor}
                        classCode={classCode}
                        key={label.title}
                        courseId={currentCourse.id}
                        userId={(student) ? student.id.id : instructor.id.id}
                    />
                    ))
                    }
                    <div id="spacer">
                    </div>
                </div>
                <div className='instructor-view' style={{display: (isInstructor) ? "" : "none"}} >
                        <button id='create-label' onClick={() => setCreate(!create)} style={{visibility: (create) ? "hidden" : "visible"}}>
                            <MdPostAdd id='icon-add' />
                            <span id="create-title">Create Label</span>
                        </button>
                    <div className='add-label-view' style={{display: (create) ? "flex" : "none"}}>
                        <div className="label-header-div" >
                            <h2>Create Label</h2>
                            <h3>Label Title</h3>
                            <input type='text' id='create-input' value={labelTitle} onChange={evt => setLabelTitle(evt.target.value)}></input>
                        </div>
                        <div className="add-label-icons">
                            <FaCaretUp id="icon-up" onClick={() => setCreate(!create)} />
                            <HiCheck id='icon-check' onClick={() => addLabel()}/>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    )
}

export default CourseHomePage;