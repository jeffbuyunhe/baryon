import NavbarIcon from "./NavbarIcon.js";
import './Navbar.css';
import { useEffect, useState } from "react";
import {  useSelector } from 'react-redux';
import { AiFillHome } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import { PAGES, COURSE } from "../../../routes.js";

const Navbar = (props) => {
    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [isAdmin, setIsAdmin] = useState(null)
    const user = useSelector(state => state.user)
    const course = useSelector(state => state.course)

    const onClickHome = () => {
        if(isAdmin) navigate(PAGES.adminHome.path)
        else navigate(PAGES.homePage.path)
    }

    const onClickCourse = (courseCode) => {
        navigate(`${PAGES.courses.path}/${courseCode}${COURSE.home.path}`)
    }

    useEffect(() => {
        const tempData = []
        const colors = ["var(--purple)", "var(--red)", "var(--green)", "var(--teal)", "var(--yellow)", "var(--pink)"]
        if(course){
            for (var i = 0; i <course.length; i++){
                tempData.push({
                    ...course[i],
                    color: colors[i%6],
                    key: i,
                    abr: course[i].courseCode.substring(3, 6),
                })
            }
        }
        setData(tempData)
    }, [course]);

    useEffect(() => {
        if(user) setIsAdmin(user.isAdmin)
    }, [user]);

    const profileIcon = require('./profile.png')
    
    return(
        <div className="homepage-navbar-padding">
            <NavbarIcon abbreviation={<img className="profile-pic-img-size" src={profileIcon} alt="profile"></img>} color="var(--dark-blue)"></NavbarIcon>
            <div className="navbar-seperation-line"></div>
            <div><NavbarIcon abbreviation={<AiFillHome size={45} style={{"color":"white"}}></AiFillHome>} onclick={onClickHome}></NavbarIcon></div>
            <div className="navbar-class-list homepage-scrollable">
                {data.map(dataPoint => 
                    <NavbarIcon 
                        key={dataPoint.courseCode} 
                        abbreviation={dataPoint.abr} 
                        color={dataPoint.color} 
                        onclick={()=>onClickCourse(dataPoint.courseCode)}>
                    </NavbarIcon>)}
            </div>
        </div>
    );
}

export default Navbar;