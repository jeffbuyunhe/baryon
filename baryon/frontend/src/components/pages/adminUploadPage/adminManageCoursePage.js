import "./adminUploadPage.css"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import Navbar from "../HomePageNav/Navbar"
import { FaAngleUp, FaTimes } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { uploadEnrollStudentsCSV,
         uploadEnrollInstructorsCSV } from "../../../reducers/registrationReducer"
import { getUserAndOrganization } from "../../../reducers/userReducer"
import { getCoursesByOrgId } from "../../../reducers/adminCoursesReducer"
import { getCourseByCourseId } from "../../../reducers/adminManageCourseReducer"

const AdminManageCoursePage = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const [searchParams, setSearchParams] = useSearchParams()
    const [courseCode, setCourseCode] = useState('')
    const [expandedUpload, setExpandedUpload] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadType, setUploadType] = useState('')
    const csvType = "email"
    
    const org = useSelector(state => state.organization)
    const course = useSelector(state => state.adminManageCourse)

    const expand = (b, type) => {
        if (b === false) setSelectedFile(null)
        setExpandedUpload(b)
        setUploadType(type)
    }

    const cancel = () => {
        setSelectedFile(null)
    }

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    };

    const onRefresh = () => {
        dispatch(getCoursesByOrgId(org.id))
        if(course) dispatch(getCourseByCourseId(course.id))
    };

    const onFileSubmit = (e) => {
        e.preventDefault()
      
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (uploadType === 1)
            dispatch(uploadEnrollStudentsCSV(course.id, formData))
        else 
            dispatch(uploadEnrollInstructorsCSV(course.id, formData))

        setExpandedUpload(false)
        setSelectedFile(null)
    }

    useEffect(() => {
        const code = searchParams.get('code')
        const courseId = searchParams.get('id')
        if(code && courseId) {
            setCourseCode(code)
            dispatch(getCourseByCourseId(courseId))
        }
        else navigate("/")
    }, [dispatch, navigate, searchParams])

    useEffect(() => {
        dispatch(getUserAndOrganization())
    }, [dispatch]);
    
    return (
        <div className="admin-upload-page-layout">
            <Navbar data={[]}></Navbar>
            <div>
                <div>
                    <div className="admin-upload-title">{courseCode}</div>
                    <div className='admin-upload-title-line'></div>
                    {!expandedUpload &&
                        <div>
                            <button className='admin-upload-button' onClick={()=>expand(true, 1)}>Enroll Students</button>
                            <button className='admin-upload-button' onClick={()=>expand(true, 2)}>Enroll Instructors</button>
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
                    {course && <div style={{"margin-left":"5%"}}>
                        <p className="admin-medium" style={{"margin-top":"3%"}}>Name: {course.name}</p>
                        <p className="admin-medium">Course Code: {course.courseCode}</p>
                        <p className="admin-medium">Students: {Object.keys(course.students).length}</p>
                        <p className="admin-medium">Instructors: {Object.keys(course.instructors).length}</p>
                    </div>}
                </div>
            </div>
        </div>
    )
 }

 export default AdminManageCoursePage