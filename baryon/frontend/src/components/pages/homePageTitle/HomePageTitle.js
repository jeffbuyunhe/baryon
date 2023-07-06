import './HomePageTitle.css'

import { useSelector } from 'react-redux'

const HomePageTitle = () =>{

    const org = useSelector(state => state.organization)

    return (
        <div>
            <div className="home-page-title">
                {org ? org.name.toUpperCase() : "BARYON"}</div>
            <div className='home-page-title-line'></div>
        </div>
    )
}

export default HomePageTitle