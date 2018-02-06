import * as React from "react";

import HSProgram from "shared/types/hs-program";

import HSProgramElement from "./hs-program-element";

import "./hs-group.scss";

interface HSGroupProps {
  title: string
  programs: HSProgram[]
  selectedProgramID: string
  onSelectedProgramIDChange: (newID: string) => any
}

const HSGroup: React.SFC<HSGroupProps> = (props) => {
  return (
    <div className="hs-category-container">
      <div className="hs-category-title">
        {props.title}
      </div>
      <div className="hs-list">
        { 
          props.programs.map( (hs: HSProgram) => {
            return (
              <HSProgramElement 
                key={hs.id} 
                program={hs} 
                selected={hs.id === props.selectedProgramID}
                onSelect={ newID => props.onSelectedProgramIDChange(newID) }
              /> 
            );
          })
        }
    </div>
  </div>
  );
};

export default HSGroup;
