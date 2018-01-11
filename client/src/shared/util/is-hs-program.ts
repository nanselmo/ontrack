import CPSProgram from "shared/types/cps-program";

const isESProgram = (program: CPSProgram): boolean => {
  if (program.Primary_Category === "ES") {
    return true;
  } else if (program.Primary_Category === "HS") {
    // Academic Centers are ES (6th-8th) grade programs that are held
    // in high schools. So, (confusingly) they are labeled as "HS"
    // because their school is a high school even though the programs
    // are ES programs.
    if (program.Program_Type === "Academic Center") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default isESProgram;
