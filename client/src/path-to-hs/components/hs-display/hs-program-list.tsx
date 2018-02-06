import * as React from "react";

import HSProgram from "shared/types/hs-program";

import HSGroup from "./hs-group";

interface HSProgramListProps {
  hsProgramsByType: {[type: string]: HSProgram[]}
  selectedProgramID: string
  onSelectedProgramIDChange: (id: string) => any
}

const HSProgramList: React.SFC<HSProgramListProps> = (props) => {
  return (
    <div style={{width: "100%", height: "100%", overflowY: "auto", overflowX:"hidden"}}>
      {
        Object.keys(props.hsProgramsByType).map( programType => {
          const programs = props.hsProgramsByType[programType];
          return (<HSGroup 
            key={programType}
            title={programType}
            programs={programs}
            selectedProgramID={props.selectedProgramID}
            onSelectedProgramIDChange={ id => props.onSelectedProgramIDChange(id) }
          />)
        })
      }
    </div>
  );
};

export default HSProgramList;
