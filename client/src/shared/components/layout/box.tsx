import * as React from "react";

import "./box.scss";

interface BoxProps {
  width: "quarter" | "half" | "full"
  height: "quarter" | "half" | "full"
  zLevel?: 0 | 1 | 2 | 3 | 4 | 5
  children?: any
  responsiveBehavior?: {
    mobile?: "disappear" | "fullscreen"
  }
}

const Box = (props: BoxProps) => {

  const widthClass: string = "width-" + props.width;
  const heightClass: string = "height-" + props.height;
  let zLevelClass: string = "";
  if (props.zLevel) {
    zLevelClass = "zlevel-" + props.zLevel;
  }
  let responsiveMobileClass: string = "";
  if (props.responsiveBehavior && props.responsiveBehavior.mobile) {
    responsiveMobileClass = "mobile-" + props.responsiveBehavior.mobile;
  }
  
  const className = `box ${widthClass} ${heightClass} ${zLevelClass} ${responsiveMobileClass}`;

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

export default Box;
