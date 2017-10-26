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
      case "no-effort":
        effortLevel = EffortLevel.NONE;
        break;
      case "low-effort":
        effortLevel = EffortLevel.LOW;
        break;
      case "normal-effort":
        effortLevel = EffortLevel.NORMAL;
        break;
      case "high-effort":
        effortLevel = EffortLevel.HIGH;
        break;
      case "very-high-effort":
        effortLevel = EffortLevel.EXTREME;;
        break;
      default:
        throw new Error(`effortLevel ${value} not recognized!`);
    }
    props.onEffortLevelChange(effortLevel);
  };

  const strEffortLevel = effortLeveltoString(props.effortLevel);

  return (
    <select value={strEffortLevel} onChange={handleSelectChange} className={`effort-level-selector ${strEffortLevel}`}>
      <option 
        value="no-effort">
        {strings.noEffort}</option>
      <option 
        value="low-effort">
        {strings.lowEffort}</option>
      <option 
        value="normal-effort">
        {strings.normalEffort}</option>
      <option 
        value="high-effort">
        {strings.highEffort}</option>
      <option 
        value="very-high-effort">
        {strings.veryHighEffort}</option>
    </select>
  ) 
};

export default EffortLevelSelector;
