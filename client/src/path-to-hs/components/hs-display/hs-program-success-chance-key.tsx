import * as React from "react";

const HSProgramSuccessChanceKey = (props) => {
  // FIXME: hacky to rely on css classes as opposed to React components;
  // but the way I wrote the HSListElement component makes it not very
  // reusable. Live and learn.
  return (
    <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
      <div>
        You will almost certainly be accepted.
        <div className="hs-list-element succ-certain">
        </div>
      </div>
      <div>
        You're likely to be accepted.
        <div className="hs-list-element succ-likely">
        </div>
      </div>
      <div>
        You have a chance of being accepted.
        <div className="hs-list-element succ-uncertain">
        </div>
      </div>
      <div>
        You're less likely to be accepted.
        <div className="hs-list-element succ-unlikely">
        </div>
      </div>
      <div>
        You probably won't be accepted.
        <div className="hs-list-element succ-none">
        </div>
      </div>
    </div>
  )
};

export default HSProgramSuccessChanceKey;
