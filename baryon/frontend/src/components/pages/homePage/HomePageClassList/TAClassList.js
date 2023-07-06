
import ClassCard from './ClassCard.js';
import './ClassList.css';
import {  useSelector } from 'react-redux';

const TAClassList = (props) =>{

    var data = []
    const colors = ["var(--purple)", "var(--red)", "var(--green)", "var(--teal)", "var(--yellow)", "var(--pink)" ]
    const courses = useSelector(state => state.taCourse);

    if(courses){
        data = []
        for (var i = 0; i <courses.length; i++){
            data.push(
                {
                ...courses[i],
                color: colors[i%6],
                key: courses[i].courseCode,
                abr: courses[i].courseCode.substring(3),
            })
        }
    }

    return(
        <div>
            {courses && courses.length > 0 && <div className="homepage-class-list-title">Courses Teaching</div>}
            <div className="student-class-list-grid-design">
                {data.map(dataPoint =>
                <ClassCard 
                classCode={dataPoint.courseCode} 
                className={dataPoint.name} 
                backgroundColor={dataPoint.color} 
                key={dataPoint.courseCode}
                >
                </ClassCard>)}
            </div>
        </div>
    );
}

export default TAClassList;