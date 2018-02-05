import * as React from "react";

import StudentData from "shared/types/student-data";

import Box from "shared/components/layout/box";

import StudentDataForm from "./student-data-form";

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
