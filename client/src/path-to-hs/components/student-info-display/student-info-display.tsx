import * as React from "react";

import Box from "shared/components/layout/box";

import StudentDataForm from "./student-data-form";

// TODO mapstatetoProps
// TODO mapdispatchtostate
const StudentInfoDisplay: React.SFC<any> = (props) => {
  return (
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
  )
};

export default StudentInfoDisplay;
