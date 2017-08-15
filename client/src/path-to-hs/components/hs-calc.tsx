import * as React from "react";
import Toggle from "@shared/components/input/toggle";
import Dropdown from "@shared/components/input/dropdown";
import AddressTierCalculator from "./hs-calc/address-tier-calculator"

import "./hs-calc.scss";
//import localeStrings from "./hs-calc/locale"
// DEBUG
const locale = {
  gradeLevelDropdown: {
    "label": "Your grade level",
    "values": {
      "4": "4th grade",
      "5": "5th grade",
      "6": "6th grade",
      "7": "7th grade",
      "8": "8th grade",
    }
  }
}


const HSCalculator = (props: any) => {
  return (
    <div id="hs-calc-box" className="box">
      <div className="partition-row">
        <div className="partition-row">
          <Dropdown label={locale.gradeLevelDropdown.label}
              values={locale.gradeLevelDropdown.values}/>
          // need to manage state here
          <Toggle id="toggle-ell" />
          <Toggle id="toggle-iep" />
        </div>
        <div className="partition-row">
          <AddressTierCalculator address={null} />
        </div>
      </div>
    </div>
  )
};

export default HSCalculator;
