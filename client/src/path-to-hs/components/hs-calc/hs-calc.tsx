import * as React from "react";

import StudentInfoHeader from "./student-info-header";

const HSCalculator = (props: any) => {
  return (
    <div id="hs-calc-box" className="box">
      <StudentInfoHeader studentInfo={null} onChange={info => info} />
    </div>
  )
};

export default HSCalculator;
