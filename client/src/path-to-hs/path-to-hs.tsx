import * as React from "react";

import Box from "shared/components/layout/box";
import Page from "shared/components/layout/page";
import HSCalculator from "./components/hs-calc";

const PathToHS = (props: any) => {
  return (
    <Page>
      <HSCalculator studentInfo={null} studentGrades={null}/>
    </Page>
  )
}

export default PathToHS;
