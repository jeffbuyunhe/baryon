import "./ManagementCard.css"
import { Link } from "react-router-dom";
import { PAGES } from "../../../routes"

const ManagementCard = (props) =>{

    return (
        <div className="management-card">
            <img className="management-card-icon" src={props.icon} alt={""}/>
            <p><Link to={PAGES.adminUpload.path+"?type="+props.redirectType}>{props.title}</Link></p>
        </div>
    );
}

export default ManagementCard
