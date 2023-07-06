import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from "../../../../services/endpoints.js"
import  TableStudentsItem  from "./TableStudentsItem.js"
import { updateGrade } from './GradeUtils.js'

const TableStudentsRow = ({userId, assignmentId, column}) => {

    const [student, setStudent] = useState({})

    useEffect(() => {
        axios.get(ENDPOINTS.BASE_USER_URL + userId)
        .then(res => setStudent(res.data))
        .catch(err => setStudent({}))
    },[])

    const [studentSubmission, setStudentSubmission] = useState({})

    useEffect(() => {
        axios.get(ENDPOINTS.BASE_ASSIGNMENT_SUBMISSION_URL + assignmentId + "/" + userId)
        .then(res => {if(res.data == null){
            setStudentSubmission({
                "assignmentId": assignmentId,
                "studentId": userId,
                "submissionDate": "",
                "encodedFile" : "None",
                "id": "",
                "markObtained" : 0,
                "feedback" : ""
            })
          }
          else{
            setStudentSubmission(res.data)
          }
        })
        .catch(err => setStudentSubmission(
                {
                    "assignmentId": assignmentId,
                    "studentId": userId,
                    "submissionDate": "",
                    "encodedFile" : "None",
                    "id": "",
                    "markObtained" : 0,
                    "feedback" : ""
                }
            ))
    },[])

    if(!studentSubmission.hasOwnProperty("markObtained")){
        studentSubmission["markObtained"] = 0
      }
    if(!studentSubmission.hasOwnProperty("feedback")){
        studentSubmission["feedback"] = ""
    }

    const [feedback, setFeedback] = useState(studentSubmission.feedback)
    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    }

    const [mark, setMark] = useState(studentSubmission.markObtained)
    const handleMarkChange = (e) => {
        setMark(e.target.value);
    }

    const name = student.firstname + " " + student.lastname
    return (
        <>
            <tr>
                {column.map((columnItem) => <TableStudentsItem columnItem={columnItem} name={name} student={studentSubmission}></TableStudentsItem>)}
                <td className="assignment-subheader">{studentSubmission.markObtained}</td>
                <td><input className="mark-input" onChange={handleMarkChange}></input></td>
                <td><button className="submit-grade" onClick={() => updateGrade(mark, feedback, studentSubmission.submissionDate, studentSubmission.assignmentId, studentSubmission.studentId)}>Submit</button></td>
            </tr>
            <tr>
                <td colSpan={5} style={{borderBottom: "0.1vw solid #d2d2d2"}}>
                    <input className="feedback-instructor" placeholder={"Leave feedback here"} onChange={handleFeedbackChange}></input>
                </td>
            </tr>
        </>
    )
}

export default TableStudentsRow
