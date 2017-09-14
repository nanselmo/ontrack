import * as React from "react";

import Partition from "shared/components/layout/partition";

import StudentGrades from "shared/types/student-grades";

interface StudentGradesContainerProps {
  grades: StudentGrades | null
  onChange: (newGrades: StudentGrades) => any
}

const StudentGradesContainer = (props: StudentGradesContainerProps) => {
  return (
    <Partition>
      <div style={{height: "100px", backgroundColor: "red"}}>
      </div>
    </Partition>
  );
}

export default StudentGradesContainer;
