import React from 'react'

const StudentGradesItem = ({assignmentRow, gradeTable, columnItem}) => {

  if(columnItem.value === "title"){
    return <td className="table-row">{assignmentRow.title}</td>
  }
  if(columnItem.value === "dueDate"){
    const submitted = new Date(gradeTable.submissionDate)
    const now = new Date()
    const due = new Date(assignmentRow.dueDate)
    const date_due = "Due: " + (due.getMonth() + 1) + "/" + due.getDate()
    const date_submitted = ", " + "Submitted: " + (submitted.getMonth() + 1) + "/" + submitted.getDate()
    var date = ""
    if(gradeTable.submissionDate === ""){
        date = date_due
        if(now > due){
            return <td className="table-row-mark-fail">{date}</td>
        }
        return <td className="table-row">{date}</td>
    }
    else{
        date = date_due + date_submitted
    }

    if(due > submitted){
        return <td className="table-row-mark-pass">{date}</td>
    }
    else{
        return <td className="table-row-mark-fail">{date}</td>
    }
  }
  if(columnItem.value === "markObtained"){
    if(gradeTable.markObtained == -1){
        return <td className="table-row-text">N/A</td>
    }
    if(gradeTable.markObtained / assignmentRow.totalMark >= 0.5){
        return <td className="table-row-mark-pass">{gradeTable.markObtained + "/" + assignmentRow.totalMark}</td>
    }
    else{
        return <td className="table-row-mark-fail">{gradeTable.markObtained + "/" + assignmentRow.totalMark}</td>
    }
  }
  if(columnItem.value === "weight"){
    return <td className="table-row-text">{assignmentRow.weight * 100 + "%"}</td>
  }
}

export default StudentGradesItem