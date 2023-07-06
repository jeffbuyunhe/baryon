import './CourseAssignmentListItem.css';

import { FaAngleUp, FaTimes, FaCheck, FaFileDownload } from "react-icons/fa"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitAssignment } from '../../../reducers/assignmentsReducer';
import { ENDPOINTS } from '../../../services/endpoints';

const CourseAssignmentListItem = (props) => {
    const dispatch = useDispatch()

    const student = useSelector(state => state.student)
    const currentCourse = useSelector(state => state.currentCourse)
    const [expandedSubmit, setExpandedSubmit] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const downloadLink = `${ENDPOINTS.BASE_COURSE_FILE_URL}download/${props.fileId}`

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    };

    const onFileSubmit = (e) => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        dispatch(submitAssignment(currentCourse.id, props.assignmentId, student.id.id, formData))
        expand(false)
    };
    
    const expand = (b) => {
        if (b === false) setSelectedFile(null)
        setExpandedSubmit(b)
    }

    const cancel = () => {
        setSelectedFile(null)
    }

    return (
        <div className="course-assignment-item-container">
            <div className="course-assignment-title">{props.title}</div>
            <div className="course-assignment-descriptons-padding">
                <div className="course-assignment-subtitle">
                    <div className="course-assignment-subtitle-row">
                        <div className="course-assignment-subtitle-bold">Due</div>
                        <div>{props.dueDate}</div>
                    </div>
                    <div className="course-assignment-subtitle-row">
                        <div className="course-assignment-subtitle-bold">Weight</div>
                        <div>{props.weight}</div>
                    </div>
                </div>

                <div style={{"margin":"1% 0% 2% 0%","display":"flex","align-items":"center"}}>
                    <a href={downloadLink} style={{"display":"flex","align-items":"center"}}><FaFileDownload style={{"color":"#14229D"}}/></a>
                    <a style={{"margin-left":"1%"}}>{props.fileName}</a>
                </div>

                {student && props.submission_date && 
                <div className="course-assignment-subtitle-row" style={{"margin-top":"2%","color":"green"}}>
                    <div className="course-assignment-subtitle-bold">Submitted on</div>
                    <div>{props.submission_date}</div>
                </div>}

                {student && !props.submission_date && 
                <div className="course-assignment-subtitle-row" style={{"margin-top":"2%","color":"red"}}>
                    <div className="course-assignment-subtitle-bold">No Submission</div>
                </div>}
            </div>
        
            <div>
                {student && !expandedSubmit && <button className="course-assignment-submit-button" onClick={()=>expand(true)}>Submit</button>}
                {student && expandedSubmit && 
                    <div className='assignment-upload-card'>
                        <p className="assignment-large">Submit<FaAngleUp className="assignment-icon" onClick={()=>expand(false)}/></p>
                        <label htmlFor="assignment_uploads" className='course-assignment-submit-button-2'>Upload File</label>
                        <input id="assignment_uploads" type="file" style={{width:0}} onChange={onFileChange}/>
                        {selectedFile && 
                            <div>
                                <div style={{"display":"flex","align-items":"center"}}>
                                    <p className="assignment-small" style={{"margin":"2% 0% 1% 0%"}}>{selectedFile.name}</p>
                                    <FaTimes style={{"color":"red","margin":"1% 0% 0% 1%"}} onClick={cancel}/>
                                </div>
                                <FaCheck style={{"margin-left":"94%","stroke-width": "1px"}} onClick={onFileSubmit}/>
                            </div>}
                    </div>}
            </div>
            
            <div className="course-seperation-line"></div>
        </div>
    );
}

export default CourseAssignmentListItem;