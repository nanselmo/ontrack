import * as React from "react";

import Page from "shared/components/layout/page";
import Box from "shared/components/layout/box";
import StudentDataContainer from "./components/student-info-display/student-data-container";
import HSDisplay from "./components/hs-display/hs-display";

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
      <HSDisplay/>
    </Page>
  );
};

export default PathToHS;
