import * as React from "react";

import Page from "shared/components/layout/page";
import HSCalculator from "./components/hs-calc/hs-calc";

// FIXME: hardcoded studentScores
import StudentScores from "shared/types/student-scores";
const STUDENT_SCORES: StudentScores = {
  nweaMath: 150,
  nweaRead: 140,
  subjGradeMath: 90,
  subjGradeRead: 80,
  subjGradeSci: 79,
  subjGradeSocStudies: 66 
}
const PathToHS = (props: any) => {
  return (
    <Page>
      <HSCalculator 
        studentInfo={{}} 
        studentScores={STUDENT_SCORES}/>
    </Page>
  )
}

export default PathToHS;
