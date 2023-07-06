import Navbar from "../HomePageNav/Navbar"
import CourseNavBar from "../../navigation/CourseNavBar/CourseNavBar"
import "./MediaPage.css"
import { useState } from "react"
import MediaContent from "./MediaContent"

const MediaPage = () => {

  //TODO: replace mock data with actual data from endpoints (videos + instructor + course)
    const [media, setMedia] = useState([
      {"url":"https://www.youtube.com/watch?v=ga8K_diGviw", "label": "Bmbmbm"},
      {"url":"https://www.youtube.com/watch?v=8D3TrpQ_nFo", "label": "Sugar/Tzu"},
      {"url":"https://www.youtube.com/watch?v=uOnjuIb1TWY", "label": "Basketball Shoes (GOAT)"},
      {"url":"https://www.youtube.com/watch?v=7EGTD7azzWk", "label": "Sleep"},
      {"url":"https://www.youtube.com/watch?v=gTyzLI2IaB4", "label": "The Glowing Man"},
      {"url":"https://www.youtube.com/watch?v=7t-9rgpzU6A", "label": "Sunglasses"},
      {"url":"https://www.youtube.com/watch?v=pllRW9wETzw", "label": "Cloudbusting"},
      {"url":"https://www.youtube.com/watch?v=9ZNkPA_zUd4", "label": "Dance Yrself Clean"},
      {"url":"https://www.youtube.com/watch?v=GoLJJRIWCLU", "label": "Jigsaw Falling Into Place"},
      {"url":"https://www.youtube.com/watch?v=loB0kmz_0MM", "label": "Joga"},
      {"url":"https://www.youtube.com/watch?v=uoZgZT4DGSY", "label": "Hacker"}])

    const [isInstructor, setIsInstructor] = useState(true);

  return (
    <div className="media-home-page">
        <Navbar></Navbar>
        <CourseNavBar></CourseNavBar>
        <MediaContent media={media} isInstructor={isInstructor} setMedia={setMedia}></MediaContent>
    </div>
  )
}

export default MediaPage