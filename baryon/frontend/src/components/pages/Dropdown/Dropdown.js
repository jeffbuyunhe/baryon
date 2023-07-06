import React, {useState, cloneElement} from 'react'
import { FaCaretRight } from "react-icons/fa";

import './Dropdown.css'

export const Dropdown = ({ title, data, borderColor, menu, buttonId, dropdownClass }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(!open);
    };
  
    return (
      <div className={(dropdownClass) ? dropdownClass : 'dropdown'} style={{border: (borderColor) ? `1px solid ${borderColor}` : ""}}>
        {cloneElement(
            <button id={(buttonId) ? buttonId : 'dropdown-button'}>
            <FaCaretRight id='caret' style={{transform: (open) ? 'rotate(90deg)' : '' }} />
            <span id='title'>{title}</span>
            </button>, {
          onClick: handleOpen,
        })}
        {open ? (
          <ul className={(menu) ? menu : 'menu'}>
            {data.map((dataItem, index) => (
              <li key={index} className="menu-item">
                {cloneElement(dataItem, {
                  onClick: () => {
                    dataItem.props.onClick();
                  },
                })}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };