import { useState } from "react"
import "./StudentGradesTable"
import { ENDPOINTS } from "../../../../services/endpoints.js"
import { useEffect } from "react";
import axios from "axios";
import StudentGradesItem from "./StudentGradesItem";

const StudentGradesRow = ({assignmentRow, userId, column}) => {

    const [gradeTable, setGradeTable] = useState({});

    useEffect( () => {
        axios.get(ENDPOINTS.BASE_ASSIGNMENT_SUBMISSION_URL + assignmentRow.id + "/" + userId)
        .then(res => {if(res.data == null){
                        setGradeTable({
                          "assignmentId": "",
                          "studentId": "",
                          "submissionDate": "",
                          "encodedFile" : "",
                          "id": "",
                          "markObtained" : -1,
                          "feedback" : ""
                        })
                      }
                      else{
                        setGradeTable(res.data)
                      }
                    })
        .catch(err => setGradeTable(
            {
                "assignmentId": "",
                "studentId": "",
                "submissionDate": "",
                "encodedFile" : "",
                "id": "",
                "markObtained" : -1,
                "feedback" : ""
      }))
    },[])

    if(!gradeTable.hasOwnProperty("markObtained")){
      gradeTable["markObtained"] = "-1"
    }
    if(!gradeTable.hasOwnProperty("feedback")){
      gradeTable["feedback"] = ""
    }

  return (
    <>
    <tr>
        {column.map((columnItem) => <StudentGradesItem assignmentRow={assignmentRow} gradeTable={gradeTable} columnItem={columnItem}></StudentGradesItem>)}
    </tr>
    <tr>
        <td colSpan={4} style={{borderBottom: "0.1vw solid #d2d2d2"}}>
            <p className="feedback">{gradeTable.feedback}</p>
        </td>
    </tr>
    </>
  )
}

export default StudentGradesRow
