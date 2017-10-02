import * as React from "react";

import AdditionalRequirementData from "shared/types/additional-requirement-data";

interface HSAdditionalRequirementsProps {
  requirements: AdditionalRequirementData[]
}

const HSAdditionalRequirements: React.SFC<HSAdditionalRequirementsProps> =
  (props) => {

  return (
    <div>
      {props.requirements[0]}
    </div>
  )

};

export default HSAdditionalRequirements;
