import * as React from "react";

interface GradeChangeSelectorProps {
  percentileChange: number;
  onChange: (newPercentileChange: number) => any
}

import "./grade-change-selector.scss";

// TODO: move
const strings = {
  downALot: "go down a lot",
  down: "go down",
  noChange: "stay the same",
  up: "go up",
  upALot: "go up a lot"
};

const GradeChangeSelector = (props: GradeChangeSelectorProps) => {

  // FIXME: this is a hatchet fix for the fact that getAvgPercentileDifference
  // returns unexpected values. This should be very temporary.
  const toGradeChangeLevel = (percentileChange: number) => {
    if (percentileChange < -15) {
      return "downALot";
    } else if (percentileChange <= -5) {
      return "down";
    } else if (percentileChange < 5) {
      return "noChange";
    } else if (percentileChange <= 15) {
      return "up";
    } else {
      return "upALot";
    }
  };

  const toPercentileChange = (gradeChangeLevel: string) => {
    switch(gradeChangeLevel){
      case "downALot":
        return -20;
      case "down":
        return -10;
      case "noChange":
        return 0;
      case "up":
        return 10;
      case "upALot":
        return 20;
      default:
        throw new Error(`Unrecognized grade change level: ${gradeChangeLevel}`);
    }
  };

  const gradeChangeLevel: string = toGradeChangeLevel(props.percentileChange);

  const handleSelectChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    const selectedGradeChange = event.currentTarget.value;
    const newPercentileChange = toPercentileChange(selectedGradeChange);
    props.onChange(newPercentileChange);
  };

  return (
    <select value={gradeChangeLevel} onChange={handleSelectChange} className={`grade-change-selector ${gradeChangeLevel}`}>
      <option 
        value="downALot">
        {strings.downALot}</option>
      <option 
        value="down">
        {strings.down}</option>
      <option 
        value="noChange">
        {strings.noChange}</option>
      <option 
        value="up">
        {strings.up}</option>
      <option 
        value="upALot">
        {strings.upALot}</option>
    </select>
  ) 
};

export default GradeChangeSelector;
