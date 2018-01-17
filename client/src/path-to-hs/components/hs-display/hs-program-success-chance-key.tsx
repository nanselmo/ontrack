import * as React from "react";

import "./hs-program-success-chance-key.scss";

const HSProgramSuccessChanceKey = (props) => {
  return (
    <div className="hs-program-success-chance-key">
      <div className="hs-program-success-chance-example">
        You will almost certainly be accepted.
        <div className="hs-list-element-icon succ-certain">
        </div>
      </div>
      <div className="hs-program-success-chance-example">
        You're more likely to be accepted than other students.
        <div className="hs-list-element-icon succ-likely">
        </div>
      </div>
      <div className="hs-program-success-chance-example">
        You're about as likely to be accepted as other students.
        <div className="hs-list-element-icon succ-uncertain">
        </div>
      </div>
      <div className="hs-program-success-chance-example">
        You're less likely to be accepted than other students.
        <div className="hs-list-element-icon succ-unlikely">
        </div>
      </div>
      <div className="hs-program-success-chance-example">
        You probably won't be accepted.
        <div className="hs-list-element-icon succ-none">
        </div>
      </div>
    </div>
  )
};

export default HSProgramSuccessChanceKey;
