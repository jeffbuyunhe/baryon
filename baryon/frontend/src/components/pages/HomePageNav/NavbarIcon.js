import './NavbarIcon.css';

const NavbarIcon = (props) =>{
    return (
        <div className="navbar-class-icon" onClick={props.onclick} style={{backgroundColor: props.color}}>
            {props.abbreviation}
        </div>
    );
}

export default NavbarIcon;