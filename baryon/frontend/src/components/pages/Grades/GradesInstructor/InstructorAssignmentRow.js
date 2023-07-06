import React from 'react'
import InstructorAssignmentItem from './InstructorAssignmentItem'

const InstructorAssignmentRow = ({column, assignmentRow, courseCode}) => {
  return (
    <>
        <tr>
            {column.map((columnItem) => <InstructorAssignmentItem assignmentRow={assignmentRow} columnItem={columnItem} courseCode={courseCode}></InstructorAssignmentItem>)}
        </tr>
    </>
  )
}

export default InstructorAssignmentRow