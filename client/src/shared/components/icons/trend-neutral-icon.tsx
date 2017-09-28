import * as React from "react";

import IconComponent from "shared/types/icon";

const TrendNeutralIcon: IconComponent = (props) => {

  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      >
      <path fill="#000000" d="M22,12L18,8V11H3V13H18V16L22,12Z" />
    </svg>
  );

};

export default TrendNeutralIcon;
