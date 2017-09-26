import * as React from "react";

import EffortLevel from "shared/types/effort-level";

interface EffortIconProps {
  active: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
  level: EffortLevel
}

const EffortIcon = (props: EffortIconProps) => {

  if (props.active){
    return <div style={{tabIndex: 0}} onClick={props.onClick}>x</div>
  } else {
    return <div style={{tabIndex: 0}} onClick={props.onClick}>.</div>
  }

};

export default EffortIcon;
