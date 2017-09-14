import * as React from "react";

import {IconElement} from "../../types/icon";

interface IconButtonProps {
  icon: IconElement
  iconStyle?:{
    [rule: string]: string
  }
  style?: {
    [rule: string]: string
  }
  onClick: React.MouseEventHandler<any>
}

import "./button.scss";

const IconButton = (props: IconButtonProps) => {

  return (
    <button 
      style={props.style} 
      className="button" 
      onClick={props.onClick}>
      {props.icon}
    </button>
  )

};

export default IconButton;
