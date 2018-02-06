import * as Redux from "redux";

import AppState from "shared/types/app-state";
import ActionType from "shared/enums/action-type";

import StudentData from "shared/types/student-data";
import Gender from "shared/enums/gender";
import SuccessChance from "shared/enums/success-chance";
import HSRequirementFunction from "shared/types/hs-requirement-function";
import CPSProgram from "shared/types/cps-program";
import StudentLocation from "shared/types/student-location";

import getReqFns from "shared/util/get-req-fns";
import {getAllPrograms} from "shared/util/data-access";
const allPrograms = getAllPrograms();

const createIndexByID = (programs: CPSProgram[]): {[id: string]: number} => {
  let idx = {};
  for (let i=0; i<programs.length; i++) {
    const program = programs[i];
    idx[program.ID] = i;
  }
  return idx;
};

const lookup = (program_id: string, programs: CPSProgram[], index: {[id: string]: number}): CPSProgram => {
  return programs[index[program_id]];
};

const getHSProgramIDs = (programs: CPSProgram[]): string[] => {
  return programs.filter( program => program.Primary_Category === "HS" ).map( program => program.ID );
};

const getESProgramIDs = (programs: CPSProgram[]): string[] => {
  return programs.filter( program => program.Primary_Category === "ES" ).map( program => program.ID );
};

const getHSProgramIDsByType = (programs: CPSProgram[]): {[type: string]: string[]} => {
  const index = createIndexByID(programs);
  const hsProgramIDs = getHSProgramIDs(programs);
  let hsProgramIDsByType = {};
  for (let i=0; i<hsProgramIDs.length; i++) {
    const id = hsProgramIDs[i];
    const program = lookup(id, programs, index);
    const type = program.Program_Type;
    if (!hsProgramIDsByType[type]) {
      hsProgramIDsByType[type] = [];
    }
    hsProgramIDsByType[type].push(program);
  }
  return hsProgramIDsByType;
};


type Outcome = {application: SuccessChance, selection: SuccessChance};
type ReqFnLookup = (program: CPSProgram) => {application: HSRequirementFunction, selection: HSRequirementFunction};

const initializeOutcomes = (programs: CPSProgram[]): {[id: string]: Outcome} => {
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

const calculateOutcomes = (programs: CPSProgram[], studentData: StudentData, reqFnLookup: ReqFnLookup): {[id: string]: Outcome} => {
  let outcomes = {};
  for (let i=0; i<programs.length; i++) {
    const program = programs[i];
    const id = program.ID;
    const reqFns = reqFnLookup(program);
    outcomes[id] = {
      application: reqFns.application(studentData, program).outcome,
      selection: reqFns.selection(studentData, program).outcome
    }
  }
  return outcomes;
};

const initialState: AppState = { 
  studentData: {
    gender: Gender.NOANSWER,
    location: {
      address: "",
      tier: "",
      geo: {latitude: 0, longitude: 0},
    },
    gradeLevel: 0,
    prevGradeLevel: 0,
    currESProgramID: "",
    ell: false,
    iep: false,
    attendancePercentage: 0,
    gpa: 0,
    siblingHSProgramIDs: [""],
    seTestPercentile: 1,
    nweaPercentileMath: 1,
    nweaPercentileRead: 1,
    subjGradeMath: 0,
    subjGradeRead: 0,
    subjGradeSci: 0,
    subjGradeSocStudies: 0,
  },

  selectedHSProgramID: null,

  hsData: {
    programs: allPrograms, 
    index: createIndexByID(allPrograms),
    hsProgramIDs: getHSProgramIDs(allPrograms),
    esProgramIDs: getESProgramIDs(allPrograms),
    hsProgramIDsByType: getHSProgramIDsByType(allPrograms),

    outcomes: initializeOutcomes(allPrograms)
  }
};


const locationReducer = (state: AppState, action: Redux.AnyAction): AppState => {
  const newLocation: StudentLocation = action.payload;
  const newState = Object.assign({}, {...state}, {location: newLocation});
  return state;
};

const rootReducer = (state: AppState = initialState, action: Redux.AnyAction): AppState => {
  switch(action.type) {
    case ActionType.UpdateStudentGender:
      break;
    case ActionType.UpdateStudentLocation:
      break;
    case ActionType.UpdateStudentGradeLevel:
      break;
    case ActionType.UpdateStudentPrevGradeLevel:
      break;
    case ActionType.UpdateStudentCurrESProgram:
      break;
    case ActionType.UpdateStudentIEPStatus:
      break;
    case ActionType.UpdateStudentELLStatus:
      break;

    case ActionType.UpdateStudentNWEAPercentileMath:
      break;
    case ActionType.UpdateStudentNWEAPercentileRead:
      break;
    case ActionType.UpdateStudentSubjGradeMath:
      break;
    case ActionType.UpdateStudentSubjGradeRead:
      break;
    case ActionType.UpdateStudentSubjGradeSci:
      break;
    case ActionType.UpdateStudentSubjGradeSocStudies:
      break;
    case ActionType.UpdateStudentSETestScore:
      break;

    case ActionType.SelectHSProgram:
      break;

    default:
      return state;
  }
};

export default rootReducer;


