import "./adminUploadPage.css"
import { Link } from "react-router-dom"
import { PAGES } from "../../../routes"

const AdminManageCourse = (props) =>{

    return (
        <div>
            <div className="admin-upload-list">
                <p className="admin-medium" style={{'color':'black'}}>
                    <Link to={PAGES.adminManageCourse.path+"?code="+props.course.courseCode+"&id="+props.course.id}>
                        {props.course.courseCode}
                    </Link>
                </p>
                <p className="admin-medium">{props.course.name}</p>
                <p className="admin-medium" style={{'text-align':'center','color':'black'}}>
                    {Object.keys(props.course.students).length}
                </p>
            </div>
            <div className='admin-upload-title-line'></div>
        </div>
    );
}

export default AdminManageCourse