import * as React from "react";

import Page from "shared/components/layout/page";
import Box from "shared/components/layout/box";
import StudentDataForm from "./components/student-info-display/student-data-form";
import HSProgramSuccessChanceKey from "./components/hs-display/hs-program-success-chance-key";
import HSProgramsContainer from "./components/hs-display/hs-programs-container";

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
        <StudentDataForm/>
      </Box>
      <Box 
        width="half" 
        height="full" 
        responsiveBehavior={{mobile: "fullscreen"}}
      >
        <HSProgramSuccessChanceKey/>
        <HSProgramsContainer/>
      </Box>
    </Page>
  );
};

export default PathToHS;
