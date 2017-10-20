import * as React from "react";

import EffortLevel from "shared/types/effort-level";

import TrendDownIcon from "shared/components/icons/trend-down-icon";
import TrendNeutralIcon from "shared/components/icons/trend-neutral-icon";
import TrendUpIcon from "shared/components/icons/trend-up-icon";

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
        return <TrendDownIcon {...iconProps}/>
      case EffortLevel.LOW:
        return <TrendNeutralIcon {...iconProps}/>
      case EffortLevel.NORMAL:
        return <TrendNeutralIcon  {...iconProps}/>
      case EffortLevel.HIGH:
        return <TrendUpIcon {...iconProps}/>
      case EffortLevel.EXTREME:
        return <TrendUpIcon {...iconProps}/>
    }
  };

  return (
    <div style={{tabIndex: 0}} onClick={props.onClick}>
      {showIcon(props.level)} 
    </div>
    )

};

export default EffortIcon;
