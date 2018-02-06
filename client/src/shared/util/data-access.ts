import CPSPrograms from "shared/types/cps-programs";
import CPSProgram from "shared/types/cps-program";
import isESProgram from "shared/util/is-es-program";
import isHSProgram from "shared/util/is-hs-program";

declare const require:any;
const cpsPrograms: CPSProgram[] = require("../../shared/data/cps_programs.json");

export const getAllPrograms = (): CPSProgram[] => {
  return cpsPrograms;
};

// returns all programs, including elementary school programs and
// high school programs
export const getAllProgramsByProgramType = (): CPSPrograms => {
  const programs: CPSPrograms = groupByProgramType(cpsPrograms);
  return programs;
};

// returns just high school programs
export const getHSPrograms = (): CPSProgram[] => {
  const programs = cpsPrograms.filter(isHSProgram);
  return programs;
};

export const getHSProgramsByType = (): CPSPrograms => {
  const programs = groupByProgramType(cpsPrograms.filter(isHSProgram));
  return programs;
};

// returns just elementary school programs
export const getESPrograms = (): CPSProgram[] => {
  const programs = cpsPrograms.filter(isESProgram);
  return programs;
};

const groupByProgramType = (allPrograms: CPSProgram[]): CPSPrograms => {
  let programs: CPSPrograms = {} as CPSPrograms;
  for (let i = 0; i < allPrograms.length; i++) {
    const program = allPrograms[i];
    const programType = program.Program_Type;
    // sort programs based on programType property
    if (!programs[programType]) {
      programs[programType] = [];
    }
    programs[programType].push(program);
  }
  return programs;
};

