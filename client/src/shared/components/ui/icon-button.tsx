import * as React from "react";

import Icon from "../../types/icon";

interface IconButtonProps {
  icon: Icon
  onClick: React.MouseEventHandler<any>
}

const IconButton = (props: IconButtonProps) => {

  return (
    <button className="button" onClick={props.onClick}>
      {props.icon}
    </button>
  )

};

export default IconButton;
