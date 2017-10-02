import * as React from "react";

import Highschool from "shared/types/highschool";

interface HSListProps {
  highschools: Highschool[]
}

const HSList: React.SFC<HSListProps> = (props) => {

  return (
    <div>
      {props.highschools[0].shortName}
    </div>
  )

};

export default HSList;
