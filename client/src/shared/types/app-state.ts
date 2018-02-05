import StudentData from "shared/types/student-data";

interface AppState {
  
  studentData: StudentData

  // HS list
  selectedHSProgramID: string | null
}

export default AppState;
