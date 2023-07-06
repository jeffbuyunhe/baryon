import { downloadSubmission } from "./GradeUtils"
import { ENDPOINTS } from "../../../../services/endpoints"

const TableStudentsItem = ({columnItem, name, student}) => {

  if(columnItem.value === "name"){
    if(student.encodedFile === "None"){
      return <td className="table-row">{name}</td>
    }
    else{
      const downloadLink = ENDPOINTS.BASE_COURSE_FILE_URL + "/download/" + student.encodedFile
      return <td className="table-row"><a href={downloadLink}>{name}</a></td>
    }
  }
  if(columnItem.value === "dueDate"){
    if(student.submissionDate === ""){
      return <td className="table-row-text">No Submission</td>
    }
    const due = new Date(student.submissionDate)
    const date = (due.getMonth() + 1) + "/" + due.getDate()
    return <td className="table-row">{date}</td>
  }
}
export default TableStudentsItem
