import * as React from "react";

import {IconElement} from "../../types/icon";

interface IconButtonProps {
  icon: IconElement
  onClick: React.MouseEventHandler<any>
}

import "./button.scss";

const IconButton = (props: IconButtonProps) => {

  return (
    <button className="button" onClick={props.onClick}>
      {props.icon}
    </button>
  )

};

export default IconButton;
