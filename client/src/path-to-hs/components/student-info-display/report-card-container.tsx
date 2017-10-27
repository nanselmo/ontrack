import * as React from "react";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import EffortLevel from "shared/enums/effort-level";

import {clone, cloneAndExtend} from "shared/util/clone";

import EffortLevelSelector from "./effort-level-selector";
import ReportCard from "./report-card";

import {getAveragePercentileDifference, projectScores} from "shared/util/score-projection-utils";

interface ReportCardContainerProps {
  studentData: StudentData,
  projectedStudentData: StudentData,
  onProjectedStudentDataChange: (newData: StudentData) => any
}

const ReportCardContainer = (props: ReportCardContainerProps) => {

  const  toEffortLevel = (percentileChange: number): EffortLevel => {
    if (percentileChange < -40) {
      return EffortLevel.NONE;
    } else if (percentileChange < -20) {
      return EffortLevel.LOW;
    } else if (percentileChange < 20) {
      return EffortLevel.NORMAL;
    } else if (percentileChange < 40) {
      return EffortLevel.HIGH;
    } else {
      return EffortLevel.EXTREME;
    }
  }

  const toPercentileChange = (effortLevel: EffortLevel): number => {
    switch(effortLevel) {
      case EffortLevel.NONE:
        return -30;
      case EffortLevel.LOW:
        return -15;
      case EffortLevel.NORMAL:
        return 0;
      case EffortLevel.HIGH:
        return 15
      case EffortLevel.EXTREME:
        return 30
    }
  }

  const handleEffortLevelChange = (newEffortLevel: EffortLevel): void => {
    // if effort level has changed, change the percentile that we
    // use to project the student's scores with, and callback
    // parent with the new scores.
    const percentileChange = toPercentileChange(newEffortLevel);
    const originalGradeLevel = props.studentData.gradeLevel;
    const targetGradeLevel = 7;

    const newScores = projectScores(props.studentData.scores, percentileChange, originalGradeLevel, targetGradeLevel);
    const newStudentData = cloneAndExtend(props.studentData, {scores: newScores});
    props.onProjectedStudentDataChange(newStudentData);
  }

  const handleProjectedScoresChange = (newScores: StudentScores): void  => {
    const newStudentData = cloneAndExtend(props.studentData, {scores: newScores});
    props.onProjectedStudentDataChange(newStudentData);
  }
 
  const inferEffortLevel = (studentData: StudentData, projectedData: StudentData): EffortLevel => {
    // calculate percentile change from previous studentData
    const percentileChange = getAveragePercentileDifference(studentData.scores, 
      studentData.gradeLevel, 
      projectedData.scores,
      projectedData.gradeLevel);
    // convert percentileChange to effortLevel
    return toEffortLevel(percentileChange);
  }

  return (
    <div style={{width: "350px"}}>
      <div className="effort-level-select-container" style={{width: "100%", textAlign: "center", margin: "1em 0", lineHeight: "150%", fontSize: "140%", color: "#777"}}>
        {"Here's what your report card will look like if you "}
        <EffortLevelSelector
          effortLevel={inferEffortLevel(props.studentData, props.projectedStudentData)}
          onEffortLevelChange={handleEffortLevelChange}
        />
      </div>
      <ReportCard
        gradeLevel={7}
        scores={props.projectedStudentData.scores}
        onScoresChange={handleProjectedScoresChange}
        studentName={props.studentData.studentFirstName + " " + props.studentData.studentLastName}
      />
    </div>
  );
};

export default ReportCardContainer;
