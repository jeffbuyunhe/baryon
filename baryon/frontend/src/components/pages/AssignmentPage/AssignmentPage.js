
import Navbar from '../HomePageNav/Navbar.js';
import CourseAssignmentList from './CourseAssignmentList.js';
import CourseNavBar from '../../navigation/CourseNavBar/CourseNavBar.js'
import './AssignmentPage.css';


const AssignmentPage = (props) =>{


    return (
        <div className="assignment-page-layout">
            <Navbar></Navbar>
            <CourseNavBar></CourseNavBar>
            <CourseAssignmentList></CourseAssignmentList>
        </div>
    )
}

export default AssignmentPage;