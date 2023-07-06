import React from 'react'

import { Link } from 'react-router-dom'

import { PAGES } from '../../routes'

const NavBar = () => {
    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Link to={PAGES.home.path}>
                <p>{PAGES.home.title}</p>
            </Link>
        </div>
    )
}

export default NavBar
