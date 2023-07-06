import "./GradesInstructorMarkbook.css"
import TableStudents  from "./TableStudents.js"
import Navbar from "../../HomePageNav/Navbar"
import CourseNavBar from "../../../navigation/CourseNavBar/CourseNavBar"
import { ENDPOINTS } from "../../../../services/endpoints.js"
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState, useParams } from "react"
import NotFound from "../../NotFound.js"

const GradesInstructorMarkbook = () => {

  const course = useSelector(state => state.course)
  const user = useSelector(state => state.user)
  const courseId = course[0].id

  //very unoptimized because i dont want to learn redux
  const url = window.location.pathname
  const urlArray = url.split("/");
  const assignmentId = (urlArray.slice(-1).pop())

  const [assignmentTable, setAssignmentTable] = useState([]);

  useEffect( () => {
    axios(ENDPOINTS.BASE_ASSIGNMENT_URL + "course/" + courseId)
    .then(res => setAssignmentTable(res.data))
    .catch(err => setAssignmentTable([]))
  },[])
  
  var as = {
    "title": "",
    "dueDate": "",
    "weight": "",
    "id": "",
  }

  for (let i = 0; i < assignmentTable.length; i++){
    if(assignmentId === assignmentTable[i].id){
      as = assignmentTable[i]
      
      const dateISO = new Date(as.dueDate)
      const date = (dateISO.getMonth() + 1) + "/" + dateISO.getDate()

      return (
        <div className="home-page-layout">
          <Navbar></Navbar>
          <CourseNavBar></CourseNavBar>
          <div>
            <h1 className="assignment-header">{as.title}</h1>
            <h2 className="assignment-subheader">Due: {date} Out of: {as.totalMark}</h2>
            <hr style={{borderColor: '#7b80d9'}}/>
            <TableStudents courseId={courseId} assignmentId={assignmentId}/>
          </div>
        </div>
      ) 
    }
  }

  return <NotFound/>
}

export default GradesInstructorMarkbook