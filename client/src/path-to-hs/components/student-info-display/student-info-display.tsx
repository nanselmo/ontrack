import * as React from "react";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import EffortLevel from "shared/enums/effort-level";
import {scoreToPercentile, percentileToScore} from "shared/util/grade-convert";
import {getAveragePercentileDifference, projectScores} from "shared/util/score-projection-utils";

import Box from "shared/components/layout/box";
import {clone} from "shared/util/clone";

import ReportCardContainer from "./report-card-container";
import StudentDataForm from "./student-data-form/student-data-form";;

interface StudentInfoDisplayProps {
  studentData: StudentData
  projectedStudentData: StudentData
  onStudentDataChange: (newData: StudentData) => any
  onProjectedStudentDataChange: (newProjectedData: StudentData) => any
}


const Collapser = (props: any) => {
  return(
    <div className={`collapser ${props.collapsed}`}>
      {props.children}
    </div>
  )
};

const StudentInfoDisplay = (props: StudentInfoDisplayProps) => {

  const handleProjectedStudentDataChange = (newData: StudentData): any => {
    props.onProjectedStudentDataChange(newData);
  };

  return (
    <Box width="half" height="full" flex={{flexDirection: "column", justifyContent: "center", alignItems: "center"}} responsiveBehavior={{mobile: "fullscreen"}}>
      <Collapser>
        <StudentDataForm
          studentData={props.studentData}
          onChange={props.onStudentDataChange}
        />
      </Collapser>
      <ReportCardContainer
        studentData={props.studentData}
        projectedStudentData={props.projectedStudentData}
        onProjectedStudentDataChange={handleProjectedStudentDataChange}
    />
    </Box>
  )
};

export default StudentInfoDisplay;
