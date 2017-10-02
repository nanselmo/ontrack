import * as React from "react";

import Page from "shared/components/layout/page";
import HSCalculator from "./components/hs-calc/hs-calc";
import HSDisplay from "./components/hs-display/hs-display";

// TODO: remove hardcoded test data
import {MOCK_STUDENT_DATA, MOCK_HS_DATA} from "./hardcoded";

import StudentScores from "shared/types/student-scores";

const PathToHS = (props: any) => {
  return (
    <Page>
      <HSCalculator 
        studentData={MOCK_STUDENT_DATA} />
      <HSDisplay 
        hsData={MOCK_HS_DATA}
        studentData={MOCK_STUDENT_DATA}
      />
    </Page>
  )
}

export default PathToHS;
