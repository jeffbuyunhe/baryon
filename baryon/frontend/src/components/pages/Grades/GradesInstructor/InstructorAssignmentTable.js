import "./InstructorAssignmentTable.css"
import { useParams } from "react-router-dom"
import InstructorAssignmentRow from "./InstructorAssignmentRow.js"

const InstructorAssignmentTable = ({data, column}) => {
  const {classCode} = useParams();

  return (
    <div>
        <table className="container">
            <thead>
                <tr>{column.map((item) => <TableHeadItem item={item} />)}</tr>
            </thead>
            <tbody>
                {data.map((item) => <InstructorAssignmentRow courseCode={classCode} assignmentRow={item} column={column}/>)}
            </tbody>
        </table>
    </div>
  )
}

const TableHeadItem = ({ item }) => <th className="table-head">{item.heading}</th>

export default InstructorAssignmentTable
