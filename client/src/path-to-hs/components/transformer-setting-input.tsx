import * as React from "react";

import EffortLevel from "shared/types/effort-level";

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
      <EffortIcon 
        level={EffortLevel.NONE}  
        active={toEffortLevel(props.value) === EffortLevel.NONE}
        onClick={() => props.onChange(toValue(EffortLevel.NONE))}/>
      <EffortIcon 
        level={EffortLevel.LOW}  
        active={toEffortLevel(props.value) === EffortLevel.LOW}
        onClick={() => props.onChange(toValue(EffortLevel.LOW))}/>
      <EffortIcon 
        level={EffortLevel.NORMAL}  
        active={toEffortLevel(props.value) === EffortLevel.NORMAL}
        onClick={() => props.onChange(toValue(EffortLevel.NORMAL))}/>
      <EffortIcon 
        level={EffortLevel.HIGH}  
        active={toEffortLevel(props.value) === EffortLevel.HIGH}
        onClick={() => props.onChange(toValue(EffortLevel.HIGH))}/>
      <EffortIcon 
        level={EffortLevel.EXTREME}  
        active={toEffortLevel(props.value) === EffortLevel.EXTREME}
        onClick={() => props.onChange(toValue(EffortLevel.EXTREME))}/>
    </div>
  )

};

export default TransformerSettingInput;
