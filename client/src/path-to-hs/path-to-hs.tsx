import * as React from "react";

import Page from "shared/components/layout/page";
import HSCalculator from "./components/hs-calc";

// FIXME: hardcoded studentScores
import StudentScores from "shared/types/student-scores";
const STUDENT_SCORES: StudentScores = {
  nweaMath: 150,
  nweaRead: 140
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
