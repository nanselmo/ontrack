type Grade = string | number;

interface ToGPAGrades {
    math: Grade,
    reading: Grade,
    science: Grade,
    socialStudies: Grade
}

import toLetterGrade from "shared/util/to-letter-grade";
  
const toGPA = (grades: ToGPAGrades): string => {
  return "3.0";
};

export default toGPA;
