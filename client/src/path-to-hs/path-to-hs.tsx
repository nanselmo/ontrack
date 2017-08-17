import * as React from "react";

import Box from "shared/components/layout/box";
import HSCalculator from "./components/hs-calc";

const PathToHS = (props: any) => {
  return (
    <Box>
      <HSCalculator studentInfo={null} studentGrades={null}/>
    </Box>
  )
}

export default PathToHS;
