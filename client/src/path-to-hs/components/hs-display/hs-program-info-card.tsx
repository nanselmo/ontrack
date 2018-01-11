import * as React from "react";

import CPSProgram from "shared/types/cps-program";

import "./hs-program-info-card.scss";

interface HSInfoCardProps {
  program: CPSProgram 
  visible: boolean
}

const HSProgramInfoCard = (props: HSInfoCardProps) => {

  const hasPreviewUrl = props.program.CPS_School_Profile !== undefined;

  if (hasPreviewUrl) {
    return (
      <div className={`hs-info-card ${props.visible ? "visible" : "" }`}>
        { props.visible && 
        <iframe 
          className="hs-info-card-preview"
          src={props.program.CPS_School_Profile}>
        </iframe>
        }
      </div>
    );
  } else {
    return (
      <div className={`hs-info-card ${props.visible ? "visible" : "" }`}>
        {props.program.Long_Name}
      </div>
    )
  }
};

export default HSProgramInfoCard;
