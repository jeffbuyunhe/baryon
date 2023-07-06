import "./ClassCard.css";

import { useNavigate } from "react-router-dom";
import { PAGES, COURSE } from "../../../../routes";

const ClassCard = (props) => {
    const navigate = useNavigate()

    const onClickCourse = (courseCode) => {
        navigate(`${PAGES.courses.path}/${courseCode}${COURSE.home.path}`)
    }

    return (
        <div className="card" onClick={()=>onClickCourse(props.classCode)}>
            <div className="card-background" style={{backgroundColor: props.backgroundColor}}></div>
            <div className="card-img-hovered"></div>
            <div className="card-info">
                <h1 className="card-title">{props.classCode}</h1>
                <p className="card-description">{props.className}</p>
            </div>
      </div>
    );
}

export default ClassCard;
