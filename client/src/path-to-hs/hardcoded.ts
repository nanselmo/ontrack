import StudentScores from "shared/types/student-scores";
import StudentData from "shared/types/student-data";
import HSData from "shared/types/hs-data";

export const MOCK_STUDENT_SCORES: StudentScores = {
  nweaPercentileMath: 50,
  nweaPercentileRead: 50,
  subjGradeMath: 90,
  subjGradeRead: 80,
  subjGradeSci: 79,
  subjGradeSocStudies: 66 
}

export const MOCK_STUDENT_DATA: StudentData = {
  studentFirstName: "Testfella",
  studentLastName: "McGee",
  address: "761 W Altgeld",
  ell: true,
  iep: false,
  gradeLevel: 5,
  tier: "4",
  scores: MOCK_STUDENT_SCORES,
}

