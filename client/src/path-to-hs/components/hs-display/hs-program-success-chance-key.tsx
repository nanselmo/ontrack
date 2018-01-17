import * as React from "react";

import "./hs-program-success-chance-key.scss";

const HSProgramSuccessChanceKey = (props) => {
  // FIXME: hacky to rely on css classes as opposed to React components;
  // but the way I wrote the HSListElement component makes it not very
  // reusable. Live and learn.
  return (
    <div className="hs-program-success-chance-key">
      <div className="hs-program-success-chance-example">
        You will almost certainly be accepted.
        <div className="hs-list-element-icon succ-certain">
        </div>
      </div>
      <div className="hs-program-success-chance-example">
        You're likely to be accepted.
        <div className="hs-list-element-icon succ-likely">
        </div>
      </div>
      <div className="hs-program-success-chance-example">
        You have a chance of being accepted.
        <div className="hs-list-element-icon succ-uncertain">
        </div>
      </div>
      <div className="hs-program-success-chance-example">
        You're less likely to be accepted.
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
