import * as React from "react";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import EffortLevel from "shared/enums/effort-level";
import {scoreToPercentile, percentileToScore} from "shared/util/grade-convert";
import {getAveragePercentileDifference, projectScores} from "shared/util/score-projection-utils";

import Box from "shared/components/layout/box";
import clone from "shared/util/clone";

import ReportCardContainer from "./report-card-container";
//import ReportCard from "./report-card";
//import DemographicInfo from "./demographic-info";

interface StudentInfoDisplayProps {
  studentData: StudentData
  projectedStudentData: StudentData
  onProjectedStudentDataChange(projectedData: StudentData)
}

interface StudentInfoDisplayState {
  //projectedStudentData: StudentData
}

const StudentInfoDisplay = (props: StudentInfoDisplayProps) => {

  const projectData = (data: StudentData, percentileChange: number): StudentData => {
    const newData = clone(data);
    const targetGrade = 7;
    newData.scores = projectScores(newData.scores, percentileChange, data.gradeLevel, 7);
    return newData;
  };
  

  const handleProjectedStudentDataChange = (newData: StudentData): any => {
    props.onProjectedStudentDataChange(newData);
  };

  return (
    <Box width="half" height="full" flex={{flexDirection: "column", justifyContent: "center", alignItems: "center"}} responsiveBehavior={{mobile: "fullscreen"}}>
      <ReportCardContainer
        studentData={props.studentData}
        projectedStudentData={props.projectedStudentData}
        onProjectedStudentDataChange={handleProjectedStudentDataChange}
    />
    </Box>
  )

};

export default StudentInfoDisplay;
