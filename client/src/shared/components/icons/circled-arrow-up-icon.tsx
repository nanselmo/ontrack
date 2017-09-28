import * as React from "react";

import IconComponent from "shared/types/icon";

const CircledArrowUpIcon: IconComponent = (props) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24">
    <path fill="#000000" d="M12,7L17,12H14V16H10V12H7L12,7M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20Z" />
    </svg>
  )

};

export default CircledArrowUpIcon;
