import "./TableStudents.css"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { ENDPOINTS } from "../../../../services/endpoints.js"
import  TableStudentsRow  from "./TableStudentsRow.js"

const TableStudents = ({courseId, assignmentId}) => {

  const [studentTable, setStudentTable] = useState([])

  useEffect( () => {
    axios.get(ENDPOINTS.BASE_COURSE_URL + courseId)
    .then(res => setStudentTable(res.data.students))
    .catch(err => setStudentTable([]))
  },[])

  const column = [
    {heading: 'Name', value: 'name'},
    {heading: 'Submitted', value: 'dueDate'},
  ]

  const column_two = [
    {heading: 'Current Mark', value: 'currentMark'},
    {heading: 'Mark', value: 'markObtained'},
    {heading: 'Submit', value: 'submit'},
  ]

  const TableHeadItem = ({ item }) => <th className="table-head">{item.heading}</th>

  return (
    <table className="container" style={{marginTop: "0vw"}}>
      <thead>
        <tr>{column.map((item) => <TableHeadItem item={item} />)}
            {column_two.map((item) => <TableHeadItem item={item} />)}</tr>
      </thead>
      <tbody>
        {studentTable.map((item) => <TableStudentsRow assignmentId={assignmentId} userId={item} column={column}/>)}
      </tbody>
    </table>
  )
}

export default TableStudents