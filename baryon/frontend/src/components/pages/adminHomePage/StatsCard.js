import './StatsCard.css'

const StatsCard = (props) =>{

    return (
        <div className="stats-card">
            <div>
                <p className="font-small">{props.title}</p>
                <p className="font-large">{props.stats}</p>
            </div>
            <img className="stats-card-icon" src={props.icon} alt={""}/>
      </div>
    );
}

export default StatsCard