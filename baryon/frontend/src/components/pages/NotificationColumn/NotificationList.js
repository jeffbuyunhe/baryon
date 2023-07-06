import NotificationListItem from './NotificationListItem.js';
import './NotificationList.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAnnoucement } from '../../../reducers/announcementReducer';
import  instructorService  from '../../../services/instructorService';
const NotificationList = (props) =>{

    const profileIcon = require('../HomePageNav/profile.png')
    const student = useSelector(state => state.student);
    const instructor = useSelector(state => state.instructor);
    const org = useSelector(state => state.organization);
    const courses = useSelector(state => state.course);
    const announcements = useSelector(state => state.announcement);
    const dispatch = useDispatch();
    let courseData = [];

    if(courses){
        courseData = []
        for (var i = 0; i <courses.length; i++){
            courseData.push(
                {
                ...courses[i],
                key: courses[i].courseCode,
            })
            
        }
    }

    const createAnnoucements = () =>{
        let classCode = document.getElementById("classCode");
        let annoucementMessage = document.getElementById("annoucement-input-field");
        const textData = annoucementMessage.value;
        annoucementMessage.value = "";
        dispatch(createAnnoucement({
            announcement: textData,

        }, classCode.value));
    }


    return (
        <div className="notification-container  homepage-scrollable">
            <div className=" notification-tester">
                <NotificationListItem 
                    announcement={true} 
                    date="2022/10/2" 
                    profilePic={profileIcon}
                    posterName="Brian" 
                    posterTitle="Instructor"
                    postText="I had never even seen a shooting star before. 25 years of rotations, 
                                passes through comets' paths, and travel, and to my memory I had never witnessed 
                                    burning debris scratch across the night sky. Radiohead were hunched over 
                                        their instruments. Thom Yorke slowly beat on a grand piano,"
                ></NotificationListItem>
                {announcements && announcements.map(datapoint => <NotificationListItem announcement={true} date={datapoint.createdAt.substring(0, 10)} profilePic={profileIcon}  posterName={datapoint.instructorName} posterTitle="Instructor" postText={datapoint.announcement} key={datapoint.id}></NotificationListItem>)}
                                    
                <div className="end-marker-container">
                    <div className="notification-list-end-marker">You've Reached the End!</div>
                </div>
            </div>

            {instructor &&
            <div className="notification-make-announcement-border">
                <div className="notification-make-announcement">
                    <div className="notification-make-announcement-row">
                        <div className="profile-pic">
                            <div className="notification-list-poster-pic">
                                    <img className="profile-pic-img-size" src={profileIcon} alt="profile"></img>
                            </div>
                        </div>    
                        <label className="announcement-input two">
                            <input type="text" placeholder="&nbsp;" id="annoucement-input-field"/>
                            <span className="placeholder">Make An Announcement</span>
                        </label>
                    </div>
                    <div className="notification-make-announcement-row notification-space-between">
                    <select name="classCode" id="classCode" className="select-box">
                        {courseData.map(datapoint => <option value={datapoint.id} key={datapoint.key}>{datapoint.courseCode}</option>)}
                    </select>
                    <button className="css-button-shadow-border-sliding--blue" onClick={()=>createAnnoucements()}>Post</button>
                    </div>
                    
                </div>
            </div>
            }
        </div>
    );
}
export default NotificationList;