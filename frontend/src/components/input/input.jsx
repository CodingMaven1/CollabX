import React from "react";

import './input.scss';

const Input = (props) => {
    return(
        <input className="Input" value={props.value} placeholder={props.placeholder} type={props.type} onChange={props.change} />
    )
}

export default Input;