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
import denormalize from "shared/util/denormalize";
import isESProgram from "shared/util/is-es-program";
import isHSProgram from "shared/util/is-hs-program";
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
  return programs.filter( isHSProgram ).map( program => program.ID );
};

const getESProgramIDs = (programs: CPSProgram[]): string[] => {
  return programs.filter( isESProgram ).map( program => program.ID );
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
    hsProgramIDsByType[type].push(id);
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
    ell: false,
    iep: false,
    attendancePercentage: 0,
    gpa: 0,

    currESProgramID: undefined,
    siblingHSProgramIDs: [],
    seTestPercentile: 0,
    nweaPercentileMath: 0,
    nweaPercentileRead: 0,
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


const genderReducer = (state: AppState, action: Redux.AnyAction): AppState => {
  return Object.assign({}, {...state}, {gender: action.payload});
};

const locationReducer = (state: AppState, action: Redux.AnyAction): AppState => {
  const newLocation: StudentLocation = action.payload;
  const newStudentData = Object.assign({}, {...state.studentData}, {location: newLocation});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const gradeLevelReducer = (state, action): AppState => {
  const newStudentData = Object.assign({}, {...state.studentData}, {gradeLevel: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const prevGradeLevelReducer = (state, action): AppState => {
  const newStudentData = Object.assign({}, {...state.studentData}, {prevGradeLevel: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const currEsProgramReducer = (state, action): AppState => {
  const newStudentData = Object.assign({}, {...state.studentData}, {currESProgramID: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const siblingHSProgramReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {siblingHSProgramIDs: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const iepStatusReducer = (state, action): AppState => {
  const newStudentData = Object.assign({}, {...state.studentData}, {iep: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const ellStatusReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {ell: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const nweaPercentileMathReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {nweaPercentileMath: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const nweaPercentileReadReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {nweaPercentileRead: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const subjGradeMathReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {subjGradeMath: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const subjGradeReadReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {subjGradeRead: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const subjGradeSciReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {subjGradeSci: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const subjGradeSocStudiesReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {subjGradeSocStudies: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const seTestPercentileReducer = (state, action): AppState => {
  const newStudentData =  Object.assign({}, {...state.studentData}, {seTestPercentile: action.payload});
  const hsPrograms = state.hsData.hsProgramIDs.map( program => denormalize(program, state.hsData.programs, state.hsData.index));
  const newOutcomes = calculateOutcomes(hsPrograms, newStudentData, getReqFns);
  const newHSData = Object.assign({}, {...state.hsData}, {outcomes: newOutcomes});
  return Object.assign({}, state, {studentData: newStudentData}, {hsData: newHSData});
};

const selectHSProgramReducer = (state, action): AppState => {
  return Object.assign({}, {...state}, {selectedProgramID: action.payload});
};

const rootReducer = (state: AppState = initialState, action: Redux.AnyAction): AppState => {
  switch(action.type) {
    case ActionType.UpdateStudentGender:
      return genderReducer(state, action);

    case ActionType.UpdateStudentLocation:
      return locationReducer(state, action);

    case ActionType.UpdateStudentGradeLevel:
      return gradeLevelReducer(state, action);

    case ActionType.UpdateStudentPrevGradeLevel:
      return prevGradeLevelReducer(state, action);

    case ActionType.UpdateStudentCurrESProgram:
      return currEsProgramReducer(state, action);

    case ActionType.UpdateStudentSiblingHSPrograms:
      return siblingHSProgramReducer(state, action);

    case ActionType.UpdateStudentIEPStatus:
      return iepStatusReducer(state, action);

    case ActionType.UpdateStudentELLStatus:
      return ellStatusReducer(state, action);

    case ActionType.UpdateStudentNWEAPercentileMath:
      return nweaPercentileMathReducer(state, action);

    case ActionType.UpdateStudentNWEAPercentileRead:
      return nweaPercentileReadReducer(state, action);

    case ActionType.UpdateStudentSubjGradeMath:
      return subjGradeMathReducer(state, action);

    case ActionType.UpdateStudentSubjGradeRead:
      return subjGradeReadReducer(state, action);

    case ActionType.UpdateStudentSubjGradeSci:
      return subjGradeSciReducer(state, action);

    case ActionType.UpdateStudentSubjGradeSocStudies:
      return subjGradeSocStudiesReducer(state, action);

    case ActionType.UpdateStudentSETestScore:
      return seTestPercentileReducer(state, action);

    case ActionType.SelectHSProgram:
      return selectHSProgramReducer(state, action);

    default:
      console.warn(`No reducer for actiontype ${action.type}`);
      return state;
  }
};

export default rootReducer;


