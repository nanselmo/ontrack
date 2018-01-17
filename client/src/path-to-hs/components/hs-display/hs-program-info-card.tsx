import * as React from "react";

import CPSProgram from "shared/types/cps-program";
import SuccessChance from "shared/enums/success-chance";

import "./hs-program-info-card.scss";

interface HSInfoCardProps {
  program: CPSProgram 
  visible: boolean
  applicationSuccess: SuccessChance
  selectionSuccess: SuccessChance
}

const HSProgramInfoCard = (props: HSInfoCardProps) => {
  
  const toMessage = (success: SuccessChance): string => {
    let msg: string;
    switch(success) {
        case SuccessChance.CERTAIN:
          msg = "You meet this requirement.";
        break;
        case SuccessChance.LIKELY:
          msg = "You are more likely to meet this requirement than other people who apply.";
        break;
        case SuccessChance.UNCERTAIN:
          msg = "You are just as likely to meet this requirement as everyone else.";
        break;
        case SuccessChance.UNLIKELY:
          msg = "You are less likely to meet this requirement than other people who apply."
        break;
        case SuccessChance.NONE:
          msg = "You do not meet this requirement.";
        break;
        case SuccessChance.NOTIMPLEMENTED:
          msg = "We don't know enough about this requirement to tell you.";
        break;
    }
    return msg;
  };

  return (
    <div className={`hs-info-card-container ${props.visible ? "visible" : "" }`}>
      <div className="hs-info-card">
        <div className="hs-info-card-program-name">
          {`${props.program.Short_Name} - ${props.program.Program_Type} Program`}
        </div>
        <div className="hs-info-card-requirement-container">
          <div className="hs-info-card-requirement">
            <div className="hs-info-card-req-desc-container">
              To Apply:
              <div className="hs-info-card-req-desc">
                {props.program.Application_Requirements}
              </div>
            </div>
            <div className="hs-info-card-req-success">
              {toMessage(props.applicationSuccess)}
            </div>
          </div>
          <div className="hs-info-card-requirement">
            <div className="hs-info-card-req-desc-container">
              To Be Selected:
              <div className="hs-info-card-req-desc">
                {props.program.Program_Selections}
              </div>
            </div>
            <div className="hs-info-card-req-success">
              {toMessage(props.selectionSuccess)}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  } ;

export default HSProgramInfoCard;
