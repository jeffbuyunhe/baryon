import React from 'react'
import { Link } from 'react-router-dom'
import { PAGES, COURSE } from "../../../../routes"

const InstructorAssignmentItem = ({assignmentRow, columnItem, courseCode}) => {
  if(columnItem.value === "title"){
    return <td><Link to={{pathname:`${PAGES.courses.path}/${courseCode}${COURSE.grades.path}/${assignmentRow.id}`}}><button className="table-button">{assignmentRow.title}</button></Link></td>  
  }
  if(columnItem.value === "dueDate"){
    const due = new Date(assignmentRow.dueDate)
    const date = (due.getMonth() + 1) + "/" + due.getDate()
    return <td className="table-row-text">{date}</td>
  }
  if(columnItem.value === "weight"){
    const weight = assignmentRow.weight * 100 + "%"
    return <td className="table-row-text">{weight}</td>
  }
}


export default InstructorAssignmentItem