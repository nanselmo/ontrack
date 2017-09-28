import * as React from "react";

import EffortLevel from "shared/types/effort-level";

import NoEffortIcon from "shared/components/icons/no-effort-icon";
import LowEffortIcon from "shared/components/icons/low-effort-icon";
import NormalEffortIcon from "shared/components/icons/normal-effort-icon";
import HighEffortIcon from "shared/components/icons/high-effort-icon";
import ExtremeEffortIcon from "shared/components/icons/extreme-effort-icon";

interface EffortIconProps {
  active?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
  level: EffortLevel
}

const EffortIcon = (props: EffortIconProps) => {

  const showIcon = (level: EffortLevel) => {
    const iconProps = {
      width: "24px",
      height: "24px"
    };
    switch(level) {
      case EffortLevel.NONE:
        return <NoEffortIcon {...iconProps}/>
      case EffortLevel.LOW:
        return <LowEffortIcon {...iconProps}/>
      case EffortLevel.NORMAL:
        return <NormalEffortIcon {...iconProps}/>
      case EffortLevel.HIGH:
        return <HighEffortIcon {...iconProps}/>
      case EffortLevel.EXTREME:
        return <HighEffortIcon {...iconProps}/>
    }
  };

  return (
    <div style={{tabIndex: 0}} onClick={props.onClick}>
      {showIcon(props.level)} 
    </div>
    )

};

export default EffortIcon;
