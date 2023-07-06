import "./StudentGradesTable.css"
import StudentGradesRow from "./StudentGradesRow"

const StudentGradesTable = ({data, column, userId}) => {

  return (
    <div>
        <table className="container">
            <thead>
                <tr>{column.map((item) => <TableHeadItem item={item} />)}</tr>
            </thead>
            <tbody>
                {data.map((item) => <StudentGradesRow column={column} assignmentRow={item} userId={userId}/>)}
            </tbody>
        </table>
    </div>
  )
}

const TableHeadItem = ({ item }) => <th className="table-head">{item.heading}</th>

export default StudentGradesTable
