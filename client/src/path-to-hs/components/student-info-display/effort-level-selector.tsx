import * as React from "react";

import EffortLevel from "shared/enums/effort-level";

interface EffortLevelSelectorProps {
  effortLevel: EffortLevel
  onEffortLevelChange: (newLevel: EffortLevel) => any
}

import "./effort-level-selector.scss";

// TODO: move
const strings = {
  noEffort: "don't try at all",
  lowEffort: "don't try very hard",
  normalEffort: "try as hard as you're doing now",
  highEffort: "try harder than you're doing now",
  veryHighEffort: "try very, very hard"
};

const EffortLevelSelector = (props: EffortLevelSelectorProps) => {

  const effortLeveltoString = (effortLevel: EffortLevel) => {
    switch(effortLevel) {
      case EffortLevel.NONE:
        return "no-effort";
      case EffortLevel.LOW:
        return "low-effort";
      case EffortLevel.NORMAL:
        return "normal-effort";
      case EffortLevel.HIGH:
        return "high-effort";
      case EffortLevel.EXTREME:
        return "very-high-effort";
    }
  };

  const handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    let effortLevel: EffortLevel;
    switch(value){
      case "noEffort":
        effortLevel = EffortLevel.NONE;
        break;
      case "lowEffort":
        effortLevel = EffortLevel.LOW;
        break;
      case "normalEffort":
        effortLevel = EffortLevel.NORMAL;
        break;
      case "highEffort":
        effortLevel = EffortLevel.HIGH;
        break;
      case "veryHighEffort":
        effortLevel = EffortLevel.EXTREME;;
        break;
      default:
        throw new Error(`effortLevel ${value} not recognized!`);
    }
    props.onEffortLevelChange(effortLevel);
  };

  const strEffortLevelAsString = effortLeveltoString(props.effortLevel);

  return (
    <select onChange={handleSelectChange} className={`effort-level-selector ${effortLeveltoString(props.effortLevel)}`}>
      <option 
        value="noEffort"
        selected={props.effortLevel === EffortLevel.NONE}>
        {strings.noEffort}</option>
      <option 
        value="lowEffort"
        selected={props.effortLevel === EffortLevel.LOW}>
        {strings.lowEffort}</option>
      <option 
        value="normaEffort"
        selected={props.effortLevel === EffortLevel.NORMAL}>
        {strings.normalEffort}</option>
      <option 
        value="highEffort"
        selected={props.effortLevel === EffortLevel.HIGH}>
        {strings.highEffort}</option>
      <option 
        value="veryHighEffort"
        selected={props.effortLevel === EffortLevel.EXTREME}>
        {strings.veryHighEffort}</option>
    </select>
  )
};

export default EffortLevelSelector;
