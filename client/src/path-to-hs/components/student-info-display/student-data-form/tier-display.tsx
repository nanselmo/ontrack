import * as React from "react";

import "./tier-display.scss";
import "./spinning-load-icon.scss";

interface TierDisplayProps {
  value: string 
  inProgress: boolean
}

const TierDisplay = (props: TierDisplayProps) => {
  if (props.inProgress) {
    return (
      <div className="tier-display">
        <div className="spinning-load-icon">Loading...</div>
      </div>
    )
  } else {
    return (
      <div className="tier-display">
        {props.value}
      </div>
    )
  }
};

export default TierDisplay;
