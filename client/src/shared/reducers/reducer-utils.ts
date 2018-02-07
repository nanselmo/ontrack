import CPSProgram from "shared/types/cps-program";
import StudentData from "shared/types/student-data";
import HSRequirementFunction from "shared/types/hs-requirement-function";
import SuccessChance from "shared/enums/success-chance";
import isHSProgram from "shared/util/is-hs-program";
import isESProgram from "shared/util/is-es-program";
import denormalize from "shared/util/denormalize";

type Outcome = {application: SuccessChance, selection: SuccessChance};
type ReqFnLookup = (program: CPSProgram) => {application: HSRequirementFunction, selection: HSRequirementFunction};

export const createIndexByID = (programs: CPSProgram[]): {[id: string]: number} => {
  let idx = {};
  for (let i=0; i<programs.length; i++) {
    const program = programs[i];
    idx[program.ID] = i;
  }
  return idx;
};

const alphaSortPrograms= (a: CPSProgram, b: CPSProgram) => {
  if (a.Short_Name < b.Short_Name) {
    return -1;
  } else if (a.Short_Name === b.Short_Name) {
    return 0;
  } else if (a.Short_Name > b.Short_Name) {
    return 1;
  }
};

export const getHSProgramIDs = (programs: CPSProgram[]): string[] => {
  return programs.filter( isHSProgram ).sort( alphaSortPrograms ).map( program => program.ID );
};

export const getESProgramIDs = (programs: CPSProgram[]): string[] => {
  return programs.filter( isESProgram ).sort( alphaSortPrograms ).map( program => program.ID );
};

export const getHSProgramIDsByType = (programs: CPSProgram[]): {[type: string]: string[]} => {
  const index = createIndexByID(programs);
  const hsProgramIDs = getHSProgramIDs(programs);
  let hsProgramIDsByType = {};
  for (let i=0; i<hsProgramIDs.length; i++) {
    const id = hsProgramIDs[i];
    const program = denormalize(id, programs, index);
    const type = program.Program_Type;
    if (!hsProgramIDsByType[type]) {
      hsProgramIDsByType[type] = [];
    }
    hsProgramIDsByType[type].push(id);
  }
  return hsProgramIDsByType;
};

export const initializeOutcomes = (programs: CPSProgram[]): {[id: string]: Outcome} => {
  let outcomes = {};
  for (let i=0; i<programs.length; i++) {
    const program = programs[i];
    const id = program.ID;
    outcomes[id] = {
      application: SuccessChance.NOTIMPLEMENTED,
      selection: SuccessChance.NOTIMPLEMENTED
    }
  }
  return outcomes;
};

export const calculateOutcomes = (programs: CPSProgram[], studentData: StudentData, reqFnLookup: ReqFnLookup): {[id: string]: Outcome} => {
  let outcomes = {};
  for (let i=0; i<programs.length; i++) {
    const program = programs[i];
    const id = program.ID;
    const reqFns = reqFnLookup(program);
    try {
      outcomes[id] = {
        application: reqFns.application(studentData, program).outcome,
        selection: reqFns.selection(studentData, program).outcome
      }
    } catch(e) {
      console.error(e);
      console.error(program);
      console.warn(reqFns)
    }
  }
  return outcomes;
};
