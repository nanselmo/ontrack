import * as React from "react";

import StudentData from "shared/types/student-data";
import CPSPrograms from "shared/types/cps-programs";
import CPSProgram from "shared/types/cps-program";

import Box from "shared/components/layout/box";
import HSProgramType from "./hs-program-type";
import HSProgramSuccessChanceKey from "./hs-program-success-chance-key";

interface HSDisplayProps {
  studentData: StudentData
  hsData: CPSPrograms
};

const HSDisplay: React.SFC<HSDisplayProps> = (props) => {

  return (
    <Box width="half" height="full" responsiveBehavior={{mobile: "fullscreen"}}>
      <HSProgramSuccessChanceKey/>
      <div style={{width: "100%", height: "100%", overflowY: "auto", overflowX:"hidden"}}>
        { Object.keys(props.hsData).map( (programType: string) => {
        return <HSProgramType
          programType={programType}
          programs={props.hsData[programType]}
          studentData={props.studentData}
          key={programType}/>
        }) }
      </div>
    </Box>
  )

};

export default HSDisplay;
