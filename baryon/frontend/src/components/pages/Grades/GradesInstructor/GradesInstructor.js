import "./GradesInstructor.css"
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react"
import InstructorAssignmentTable from "./InstructorAssignmentTable.js"
import Navbar from "../../HomePageNav/Navbar"
import CourseNavBar from "../../../navigation/CourseNavBar/CourseNavBar"
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ENDPOINTS } from "../../../../services/endpoints.js"

const GradesInstructor = () => {

  const course = useSelector(state => state.course)
  const user = useSelector(state => state.user)

  const {classCode} = useParams();
  const [currentCourse, setCurrentCourse] = useState(course.find(x => x.courseCode === classCode))

  useEffect(() => {
    if(course)
        setCurrentCourse(course.find(x => x.courseCode === classCode))
  },[course, classCode])
    const [dataTable, setDataTable] = useState([]);

    useEffect( () => {
    axios(ENDPOINTS.BASE_ASSIGNMENT_URL + "course/" + currentCourse.id)
    .then(res => setDataTable(res.data))
    .catch(err => setDataTable([]))
  },[])
  
    const column = [
    {heading: 'Assignment', value: 'title'},
    {heading: 'Due', value: 'dueDate'},
    {heading: 'Weight', value: 'weight'},
    ]

    return(
        <div className="home-page-layout">
            <Navbar></Navbar>
            <CourseNavBar></CourseNavBar>
            <div>
                <InstructorAssignmentTable data={dataTable} column={column}/>
            </div>
        </div>
    )
}

export default GradesInstructor