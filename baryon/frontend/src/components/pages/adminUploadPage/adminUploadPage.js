import "./adminUploadPage.css"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import Navbar from "../HomePageNav/Navbar"
import { FaAngleUp, FaTimes } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { uploadInviteFacultyCSV, 
         uploadInviteStudentsCSV, 
         uploadAddCoursesCSV } from "../../../reducers/registrationReducer"
import { getUserAndOrganization } from "../../../reducers/userReducer"
import { getStudentsByOrgId } from "../../../reducers/adminStudentsReducer"
import { getInstructorsByOrgId } from "../../../reducers/adminInstructorsReducer"
import { getCoursesByOrgId } from "../../../reducers/adminCoursesReducer"
import AdminManageCourse from "./adminManageCourse"

const AdminUploadPage = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const [searchParams, setSearchParams] = useSearchParams()
    const [expandedUpload, setExpandedUpload] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [type, setType] = useState('')
    const [csvType, setCsvType] = useState('')
    const [uploadPrompt, setUploadPrompt] = useState('')
    
    const org = useSelector(state => state.organization)
    const students = useSelector(state => state.adminStudents)
    const faculty = useSelector(state => state.adminInstructors)
    const courses = useSelector(state => state.adminCourses)

    const expand = (b) => {
        if (b === false) setSelectedFile(null)
        setExpandedUpload(b)
    }

    const cancel = () => {
        setSelectedFile(null)
    }

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    };

    const onRefresh = () => {
        dispatch(getStudentsByOrgId(org.id))
        dispatch(getInstructorsByOrgId(org.id))
        dispatch(getCoursesByOrgId(org.id))
    };

    const onFileSubmit = (e) => {
        e.preventDefault()
      
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (type === 'students')
            dispatch(uploadInviteStudentsCSV(formData))
        else if (type === 'faculty')
            dispatch(uploadInviteFacultyCSV(formData))
        else
            dispatch(uploadAddCoursesCSV(formData))

        setExpandedUpload(false)
        setSelectedFile(null)
    }

    useEffect(() => {
        const type = searchParams.get('type')
        if(type) {
            setType(searchParams.get('type'))
            setCsvType(
                type === "courses" ?
                "name,courseCode" :
                "firstname,lastname,email"
            )
            setUploadPrompt(
                type === "courses" ?
                "Add Courses" :
                type === "students" ?
                "Invite Students" :
                "Invite Faculty"
            )
        }
        else navigate("/")
    }, [navigate, searchParams])

    useEffect(() => {
        dispatch(getUserAndOrganization())
    }, [dispatch]);

    useEffect(() => {
        if (org && org.id) {
            dispatch(getStudentsByOrgId(org.id))
            dispatch(getInstructorsByOrgId(org.id))
            dispatch(getCoursesByOrgId(org.id))
        }
    }, [dispatch, org]);
    
    return (
        <div className="admin-upload-page-layout">
            <Navbar data={[]}></Navbar>
            <div>
                <div>
                    <div className="admin-upload-title">
                        {type.toUpperCase()}
                    </div>
                    <div className='admin-upload-title-line'></div>
                    {!expandedUpload &&
                        <div>
                            <button className='admin-upload-button' onClick={()=>expand(true)}>{uploadPrompt}</button>
                            <div className='admin-upload-title-line'></div>
                            <button className='admin-upload-refresh-button' onClick={onRefresh}>Refresh</button>
                        </div>}
                    {expandedUpload && 
                        <div className='admin-upload-card'>
                            <p className="admin-large">Add CSV File<FaAngleUp className="admin-icon" onClick={()=>expand(false)}/></p>
                            <p className="admin-small">Please make sure CSV has the following headers: {csvType}</p>
                            <label htmlFor="csv_uploads" className='admin-upload-button-2'>Upload CSV</label>
                            <input id="csv_uploads" type="file" accept=".csv" style={{width:0}} onChange={onFileChange}/>
                            {selectedFile && 
                                <div>
                                    <div style={{"display":"flex","align-items":"center"}}>
                                        <p className="admin-small">{selectedFile.name}</p>
                                        <FaTimes style={{"color":"red"}} onClick={cancel}/>
                                    </div>
                                    <button className='admin-upload-button-2' onClick={onFileSubmit}>Confirm</button>
                                </div>}
                        </div>}
                </div>
                <div>
                    {type === 'students' && 
                        <div> {
                            !students || Object.keys(students).length === 0 ?
                            <div className="admin-upload-text">
                                <p>Your organization has no students, invite students via uploading a CSV file above.</p>
                            </div> :
                            <div>
                                <div className="admin-upload-list">
                                    <p style={{'margin-bottom':'2%'}}>Name</p>
                                    <p style={{'margin-bottom':'2%'}}>Email</p>
                                    <p style={{'margin-bottom':'2%'}}>Registration</p></div>
                                <div className='admin-upload-title-line'></div>
                                {students.map(student => 
                                    <div><div className="admin-upload-list">
                                        <p className="admin-medium">{student.firstname} {student.lastname}</p>
                                        <p className="admin-medium">{student.email}</p>
                                        <td className="admin-medium" color_code={student.accountStatus}>
                                            {student.accountStatus === 1 ? "Unregistered" : "Registered"}
                                        </td>
                                    </div>
                                    <div className='admin-upload-title-line'></div></div>)}
                            </div>}
                        </div>}
                    {type === 'faculty' && 
                        <div> {
                            !faculty || Object.keys(faculty).length === 0 ?
                            <div className="admin-upload-text">
                                <p>Your organization has no faculty members, invite faculty members via uploading a CSV file above.</p>
                            </div> :
                            <div>
                                <div className="admin-upload-list">
                                    <p style={{'margin-bottom':'2%'}}>Name</p>
                                    <p style={{'margin-bottom':'2%'}}>Email</p>
                                    <p style={{'margin-bottom':'2%'}}>Registration</p></div>
                                <div className='admin-upload-title-line'></div>
                                {faculty.map(instructor => 
                                    <div><div className="admin-upload-list">
                                        <p className="admin-medium">{instructor.firstname} {instructor.lastname}</p>
                                        <p className="admin-medium">{instructor.email}</p>
                                        <td className="admin-medium" color_code={instructor.accountStatus}>
                                            {instructor.accountStatus === 1 ? "Unregistered" : "Registered"}
                                        </td>
                                    </div>
                                    <div className='admin-upload-title-line'></div></div>)}
                            </div>}
                        </div>}
                    {type === 'courses' && 
                        <div> {
                            !courses || Object.keys(courses).length === 0 ?
                            <div className="admin-upload-text">
                                <p>Your organization has no courses, add courses via uploading a CSV file above.</p>
                            </div> :
                            <div>
                                <div className="admin-upload-list">
                                    <p style={{'margin-bottom':'2%'}}>Code</p>
                                    <p style={{'margin-bottom':'2%'}}>Course Title</p>
                                    <p style={{'margin-bottom':'2%','text-align':'center'}}>Enrolled</p></div>
                                <div className='admin-upload-title-line'></div>
                                {courses.map(c => <AdminManageCourse course={c}></AdminManageCourse>)}
                            </div>}
                        </div>}
                </div>
            </div>
        </div>
    )
 }

 export default AdminUploadPage