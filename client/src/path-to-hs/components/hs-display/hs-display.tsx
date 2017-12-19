import * as React from "react";

import StudentData from "shared/types/student-data";
import HSPrograms from "shared/types/hs-programs";
import HSProgram from "shared/types/hs-program";

import Box from "shared/components/layout/box";
import HSProgramType from "./hs-program-type";

interface HSDisplayProps {
  studentData: StudentData
  hsData: HSPrograms
};

const HSDisplay: React.SFC<HSDisplayProps> = (props) => {

  return (
    <Box width="half" height="full" responsiveBehavior={{mobile: "fullscreen"}}>
      <div style={{width: "100%", height: "100%", overflowY: "auto"}}>
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
