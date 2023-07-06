import axios from "axios"
import { ENDPOINTS } from "../../../../services/endpoints"

export function updateGrade(mark, feedback, studentSubmissionDate, assignmentId, userId){

    if(!(studentSubmissionDate === "")){
        axios.post(ENDPOINTS.BASE_ASSIGNMENT_SUBMISSION_URL + "grade", {
            "markObtained": mark,
            "feedback": feedback,
            "assignmentId" : assignmentId,
            "studentId" : userId
        })
    }
}