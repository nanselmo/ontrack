import * as React from "react";

import Page from "shared/components/layout/page";
import Box from "shared/components/layout/box";
import StudentDataContainer from "./components/student-info-display/student-data-container";
import HSProgramSuccessChanceKey from "./components/hs-display/hs-program-success-chance-key";
import HSProgramContainer from "./components/hs-display/hs-program-list";

const PathToHS: React.SFC<any> = (props) => {
  return (
    <Page>
      <Box 
        width="half" 
        height="full" 
        flex={{
          flexDirection: "column", 
          justifyContent: "center",
          alignItems: "center"}}
        responsiveBehavior={{mobile: "fullscreen"}}
      >
        <StudentDataContainer/>
      </Box>
      <Box width="half" height="full" responsiveBehavior={{mobile: "fullscreen"}}>
        <HSProgramSuccessChanceKey/>
        <HSProgramContainer/>
      </Box>
    </Page>
  );
};

export default PathToHS;
