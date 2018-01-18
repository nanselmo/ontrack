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

  const createHSBoundLink = (name: string): string => {
    // remove "HS" from end
    let words = name.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord === "HS") {
      words.pop();
    }
    const capitalizedWords = ["TEAM", "UIC", "CCA",];
    // convert name to title case (!!!)
    const titleCaseWords = words.map( word => {
      if (capitalizedWords.indexOf(word) === -1) {
        const letters = word.toLowerCase().split("");
        letters[0] = letters[0].toUpperCase();
        return letters.join("");
      } else {
        return word;
      }
    });
    // replace " " with "-"
    const schoolName = titleCaseWords.join("-");
    return `https://hsbound.org/school/${schoolName}`;
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
              <div className="hs-info-card-req-type">
                To Apply:
              </div>
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
              <div className="hs-info-card-req-type">
                To Be Selected:
              </div>
              <div className="hs-info-card-req-desc">
                {props.program.Program_Selections}
              </div>
            </div>
            <div className="hs-info-card-req-success">
              {toMessage(props.selectionSuccess)}
            </div>
          </div>
        </div>
        <div className="hs-links-container">
          <a className="hs-link" target="_none" href={props.program.CPS_School_Profile}>School Website</a>
          <a className="hs-link" target="_none" href={createHSBoundLink(props.program.Short_Name)}>HS Bound School Page</a>
        </div>
      </div>
    </div>
    );
  } ;

export default HSProgramInfoCard;
