import * as React from "react";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import EffortLevel from "shared/enums/effort-level";

import {clone, cloneAndExtend} from "shared/util/clone";

import GradeChangeSelector from "./grade-change-selector";
import ReportCard from "./report-card";

import {getAveragePercentileDifference, projectScores} from "shared/util/score-projection-utils";

interface ReportCardContainerProps {
  studentData: StudentData,
  projectedStudentData: StudentData,
  onProjectedStudentDataChange: (newData: StudentData) => any
}

const ReportCardContainer = (props: ReportCardContainerProps) => {

  const handleGradeChangeSelectorChange = (newPercentileChange: number) => {
    const targetGradeLevel = 7;
    const newProjectedScores: StudentScores = projectScores(
      props.studentData.scores, 
      newPercentileChange,
      props.studentData.gradeLevel,
      targetGradeLevel);
    const newProjectedStudentData = cloneAndExtend(props.studentData, {scores: newProjectedScores}, {gradeLevel: targetGradeLevel});
    props.onProjectedStudentDataChange(newProjectedStudentData);
  };

  const handleProjectedScoresChange = (newScores: StudentScores): void  => {
    const newStudentData = cloneAndExtend(props.projectedStudentData, {scores: newScores});
    props.onProjectedStudentDataChange(newStudentData);
  }

  const percentileChange = getAveragePercentileDifference(
              props.studentData.scores,
              props.studentData.gradeLevel,
              props.projectedStudentData.scores,
              props.projectedStudentData.gradeLevel);

 
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <div style={{width: "350px"}}>
        <div className="effort-level-select-container" style={{width: "100%", textAlign: "center", margin: "1em 0", lineHeight: "150%", fontSize: "140%", color: "#777"}}>
          {"Here's what your report card will look like if your grades"}
          <GradeChangeSelector
            percentileChange={percentileChange}
            onChange={handleGradeChangeSelectorChange}
          />
        </div>
        <ReportCard
          gradeLevel={7}
          scores={props.projectedStudentData.scores}
          onScoresChange={handleProjectedScoresChange}
          studentName={props.studentData.studentFirstName + " " + props.studentData.studentLastName}
        />
      </div>
    </div>
  );
};

export default ReportCardContainer;
