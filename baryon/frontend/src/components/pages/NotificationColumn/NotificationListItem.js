
import './NotificationListItem.css';

const NotificationListItem = (props)=>{


    if (props.announcement){
        return(
            <div className="notification-list-item-padding">
                <div className="notification-list-item-date">{props.date}</div>
                <div className="notification-list-item-container">
                    <div className="notification-list-poster-info">
                        <div className="notification-list-poster-pic">
                            <img className="profile-pic-img-size" src={props.profilePic} alt="profile"></img>
                        </div>
                        <div className="notification-list-poster-description-container">
                            <div className="notification-list-poster-name">
                                {props.posterName}
                            </div>
                            <div className="notification-list-poster-title">
                                {props.posterTitle}
                            </div>
                        </div>
                    </div>
                    <div className="notification-list-post-text">
                        {props.postText}
                    </div>
                </div>
            </div>
        );
    }    
    else{
        return(
            <div className="notification-list-item-padding">
                <div className="notification-list-item-date">{props.date}</div>
                <div className="notification-list-item-container">
                    <div className="notification-list-assignment-box">
                        <div className="notification-list-assignment-class"  style={{backgroundColor: props.backgroundColor}}>
                            {props.courseCode}
                        </div>
                        <div className="notification-list-assignment-name">
                                <label>{props.assignmentTitle}</label>
                                <input type ="checkbox" defaultChecked={props.checked}/>
                        </div>
                        
                    </div>
                </div>
            </div>
            );
    }
}

export default NotificationListItem;