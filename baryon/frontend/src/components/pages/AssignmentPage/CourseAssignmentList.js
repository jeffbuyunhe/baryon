import './CourseAssignmentListItem.css';
import CourseAssignmentListItem from './CourseAssignmentListItem.js';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaAngleUp, FaTimes, FaCheck } from "react-icons/fa"
import { createAssignment,
         getAssignmentsByCourseIdForStudents,
         getAssignmentsByCourseIdForInstructor } from '../../../reducers/assignmentsReducer.js';
import AssignmentFormInput from './AssignmentFormInput';

const CourseAssignmentList = (props) =>{
    const dispatch = useDispatch()

    const assignments = useSelector(state => state.assignments)
    const currentCourse = useSelector(state => state.currentCourse)
    const student = useSelector(state => state.student)
    const instructor = useSelector(state => state.instructor)

    const [expandedCreate, setExpandedCreate] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [values, setValues] = useState({
        title:"",
        weight:"",
        totalMark:"",
        dueDate:"",
      });

    const inputs = [
        {
          id: 1,
          name: "title",
          type: "text",
          label: "Assignment Title",
          pattern: "^[A-za-z0-9][A-za-z0-9 ]{1,30}",
          errorMessage: "Please enter a valid title",
          required: true,
        },
        {
          id: 2,
          name: "weight",
          type: "number",
          label: "Weight",
          errorMessage: "Please enter a valid weight in percentage",
          required: true,
        },
        {
          id: 3,
          name: "totalMark",
          type: "number",
          label: "Total Mark",
          errorMessage: "Please enter a valid total mark",
          required: true,
        },
        {
          id: 4,
          name: "dueDate",
          type: "date",
          label: "Due Date",
          errorMessage: "Please enter a valid date",
          required: true,
        }
      ]

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const onSubmit = (e) => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        dispatch(createAssignment(values, formData, currentCourse.id, instructor.id.id))
        expand(false)
    }

    const onChange = (e) =>{
        setValues({...values,[e.target.name]: e.target.value})
    }
    
    const expand = (b) => {
        if (b === false) {
            setValues({
                title:"",
                weight:"",
                totalMark:"",
                dueDate:"",
              })
            setSelectedFile(null)
        }
        setExpandedCreate(b)
    }

    const cancel = () => {
        setSelectedFile(null)
    }

    useEffect(() => {
        if(student) dispatch(getAssignmentsByCourseIdForStudents(currentCourse.id, student.id.id))
    }, [dispatch, currentCourse, student]);

    useEffect(() => {
        if(instructor) dispatch(getAssignmentsByCourseIdForInstructor(currentCourse.id, instructor.id.id))
    }, [dispatch, currentCourse, instructor]);

    return (
    <div>
        {instructor &&
            <div className="course-assignment-item-container">
                {!expandedCreate && 
                    <button className="course-assignment-create-button" onClick={()=>expand(true)}>Create Assignment</button>}
                {expandedCreate && 
                    <div className='assignment-upload-card'>
                        <p className="assignment-large" style={{"font-size":"2.5vw"}}>Create Assignment<FaAngleUp style={{"margin-left": "61%"}} onClick={()=>expand(false)}/></p>
                        <form encType="multipart/form-data" onSubmit={onSubmit} style={{"margin-top":"1%"}}>
                            {inputs.map((input) => (
                                <AssignmentFormInput key={input.id}{...input} value={values[input.name]} onChange={onChange}/>))}
                            <div style={{"margin-left":"2%"}}>
                                <label className="assignment-signup-label" style={{"margin":"2% 0% 2% 0%","display":"block"}}>Upload Instruction</label>
                                <label htmlFor="assignment_uploads" className='course-assignment-submit-button-2' style={{"font-size":"1.5vw","margin":"0% 0% 1% 0%"}}>Upload File</label>
                                <input id="assignment_uploads" type="file" style={{width:0}} onChange={onFileChange}/>
                                {selectedFile && 
                                    <div>
                                        <div style={{"display":"flex","align-items":"center"}}>
                                            <p className="assignment-small" style={{"margin":"2% 0% 1% 1%"}}>{selectedFile.name}</p>
                                            <FaTimes style={{"color":"red","margin":"1% 0% 0% 1%"}} onClick={cancel}/>
                                        </div>
                                        <FaCheck style={{"margin-left":"96%","stroke-width": "1px"}} onClick={onSubmit}/>
                                    </div>}
                            </div>
                        </form>
                    </div>}
            </div>
        }

        {assignments && assignments.map(datapoint => <CourseAssignmentListItem 
            assignmentId = {datapoint.id}
            title = {datapoint.title}
            dueDate = {new Date(datapoint.dueDate).toDateString()}
            weight = {datapoint.weight}
            submission_date = {datapoint.submissionDate ? new Date(datapoint.submissionDate).toString() : null}
            fileName = {datapoint.filename}
            fileId = {datapoint.fileId}
        ></CourseAssignmentListItem>)}
    </div>
    );
}

export default CourseAssignmentList;