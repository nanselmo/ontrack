import * as React from "react";

import EffortLevel from "shared/types/effort-level";

import IconButton from "shared/components/ui/icon-button";
import CircledArrowUpIcon from "shared/components/icons/circled-arrow-up-icon";
import CircledArrowDownIcon from "shared/components/icons/circled-arrow-down-icon";
import EffortIcon from "./effort-icon";

interface TransformerSettingInputProps {
  value: number // range (0, 100)
  onChange: (value: number) => any
}
  
const TransformerSettingInput = (props: TransformerSettingInputProps) => {

  const toEffortLevel = (value: number): EffortLevel => {
    if (value < 21) {
      return EffortLevel.NONE;
    } else if (value < 41) {
      return EffortLevel.LOW;
    } else if (value < 61) {
      return EffortLevel.NORMAL;
    } else if (value < 81) {
      return EffortLevel.HIGH;
    } else {
      return EffortLevel.EXTREME;
    }
  }

  const toValue = (level: EffortLevel): number => {
    switch(level){
      case EffortLevel.NONE:
        return 20;
      case EffortLevel.LOW:
        return 40;
      case EffortLevel.NORMAL:
        return 60;
      case EffortLevel.HIGH:
        return 80;
      case EffortLevel.EXTREME:
        return 100;
    }
  }

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div 
        className="score-change-button" 
        onClick={() => props.onChange(props.value - 10)}>
          <CircledArrowDownIcon width="24px" height="24px"/>
      </div>
      <EffortIcon 
        level={toEffortLevel(props.value)}  
      />
      <div 
        className="score-change-button" 
        onClick={() => props.onChange(props.value + 10)}>
          <CircledArrowUpIcon width="24px" height="24px"/>
      </div>
    </div>
  )

};

export default TransformerSettingInput;
