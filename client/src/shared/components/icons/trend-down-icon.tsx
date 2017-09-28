import * as React from "react";

import IconComponent from "shared/types/icon";

const TrendDownIcon: IconComponent = (props) => {

  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      >
      <path fill="#000000" d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z" />
    </svg>
  );

};

export default TrendDownIcon;
