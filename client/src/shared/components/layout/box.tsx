import * as React from "react";

import "./box.scss";

interface BoxProps {
  style?: {
    [cssRule: string]: string 
  }
  children?: any
}

const Box = (props: BoxProps) => {
  return (
    <div className="box" style={props.style}>
      {props.children}
    </div>
  )
}

export default Box;
