import * as React from "react";

import IconComponent from "shared/types/icon";

const TrendUpIcon: IconComponent = (props) => {

  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      >
      <path fill="#000000" d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
    </svg>
  );

};

export default TrendUpIcon;
