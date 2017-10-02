import * as React from "react";

import Highschool from "shared/types/highschool";

interface HSListElementProps {
  highschool: Highschool
}

const HSListElement: React.SFC<HSListElementProps> = (props) => {

  return (
    <div>
      {props.highschool.shortName}
    </div>
  )

};

export default HSListElement;
