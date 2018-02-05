import * as React from "react";

import Page from "shared/components/layout/page";
import StudentInfoDisplay from "./components/student-info-display/student-info-display";
import HSDisplay from "./components/hs-display/hs-display";

const PathToHS: React.SFC<any> = (props) => {
  return (<Page>
    <StudentInfoDisplay />
    <HSDisplay/>
  </Page>);
};

export default PathToHS;
