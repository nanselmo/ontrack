import * as React from "react";

import {IconComponent, IconElement, IconProps} from "shared/types/icon";

const ArrowUpIcon: IconComponent = (props: IconProps) => {
  return (
    <svg 
      style={props.style} 
      width={props.width} 
      height={props.height} 
      x="0px" 
      y="0px" 
      viewBox="0 0 1000 1000" 
      enableBackground="new 0 0 1000 1000">
        <g><path d="M500,353L500,353l424.7,424.6l65.3-65.3L532.7,255L500,222.4L467.3,255L10,712.3l65.3,65.3L500,353z"/></g>
    </svg>
  )
};

export default ArrowUpIcon;
