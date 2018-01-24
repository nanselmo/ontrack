import * as React from "react";

import StudentData from "shared/types/student-data";

import Box from "shared/components/layout/box";

import StudentDataForm from "./student-data-form/student-data-form";

interface StudentInfoDisplayProps {
  studentData: StudentData
  onStudentDataChange: (newData: StudentData) => any
}

const StudentInfoDisplay = (props: StudentInfoDisplayProps) => {

  return (
    <Box 
      width="half" 
      height="full" 
      flex={{
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "center"}}
      responsiveBehavior={{mobile: "fullscreen"}}>

      <StudentDataForm
        studentData={props.studentData}
        onChange={props.onStudentDataChange}
      />
    </Box>
  )
};

export default StudentInfoDisplay;
