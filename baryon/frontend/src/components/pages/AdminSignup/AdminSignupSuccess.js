import "./AdminSignup.css"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa"
import { MdBook } from "react-icons/md"
import { PAGES } from "../../../routes"

const AdminSignupSuccess = () => {

  useEffect(() => {
    document.body.className = 'body-background';
  }, []);

  return (
    <div>
      <div>
        <p className="header"> THANK YOU</p>
        <p className="subheader">You're all set! Make sure to:</p>
      </div>
      <div className="body-text-style">
        <p><MdBook className="icon"/> Create Your <Link to={PAGES.login.path}>Courses</Link></p>
        <p><FaUserGraduate className="icon"/> Invite Your <Link to={PAGES.login.path}>Students</Link></p>
        <p><FaChalkboardTeacher className="icon"/> Invite Your <Link to={PAGES.login.path}>Instructors</Link></p>
      </div>
      <div className="footer">
        <p>Or just go <Link to={PAGES.login.path}>home</Link></p>
      </div>
    </div>
  )
}

export default AdminSignupSuccess