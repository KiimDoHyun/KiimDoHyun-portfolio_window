import React from 'react';
import defaultImg from '../logo.svg'
const IconBox = ({img, name}) => {
    return (
        <div className="iconBox">
            <img className="iconImg" src={img? img : defaultImg} alt="iconImg"/>
            <div className="name">{name? name : 'Icon'}</div>
        </div>
    )
}

export default React.memo(IconBox);
