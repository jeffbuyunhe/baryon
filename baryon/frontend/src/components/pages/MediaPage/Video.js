import ReactPlayer from "react-player/youtube"
import "./Video.css"

const Video = (props) => {
  return (
    <div className="video-container"> 
        <ReactPlayer url={props.url}
        controls={true}
        width="40vh"
        height="30vh"/>
        <p className="video-label">{props.label}</p>
    </div>
  )
}

export default Video