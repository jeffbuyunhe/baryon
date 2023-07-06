import Video from "./Video"
import "./MediaContent.css"
import { useState } from "react";
const MediaContent = ({media, isInstructor, setMedia}) => {
  return (
    <div>
        <div><AddVideo isInstructor={isInstructor} media={media} setMedia={setMedia}/></div>
        <div className="gallery-layout">
            {media.map((item) => <Video url={item.url} label={item.label}/>)}
        </div>
    </div>
  )
}

const AddVideo = ({isInstructor, setMedia, media}) => {

    const [url, setUrl] = useState('');
    const [label, setLabel] = useState('');

    const handleUrlChange = (e) => {
    setUrl(e.target.value);
    }

    const handleLabelChange = (e) => {
    setLabel(e.target.value);
    }

    const submitVideo = ({media, setMedia}) => {
        const newVideo = {}
        newVideo ["url"] = url;
        newVideo ["label"] = label;
        setMedia([...media, newVideo]);
        return <Video url={url} label={label}/>
    }

    if(isInstructor){
        return (
            <div className="add-video-container">
                <h1>Add Video</h1>
                <input className="video-input-long" placeholder="URL" onChange={handleUrlChange}></input>
                <input className="video-input" placeholder="Label" onChange={handleLabelChange}></input>
                <button className="video-submit" onClick={() => submitVideo({media, setMedia})}>Submit</button>
            </div>
        )
    }
    else{
        return <></>
    }
}

export default MediaContent