import * as Redux from "redux";
import { Map } from "immutable";

import AppState from "shared/types/app-state";
import ActionType from "shared/enums/action-type";
import HSRequirementFunction from "shared/types/hs-requirement-function";
import SuccessChance from "shared/enums/success-chance";
import CPSProgram from "shared/types/cps-program";

import calculateGPA from "shared/util/calculate-gpa";
import { calculateOutcomes } from "./reducer-utils";
import getReqFns from "shared/util/get-req-fns";
import selectProgram from "shared/util/select-program";

import initialState from "./initial-state";


type ReqFnSelector = (program: CPSProgram) => {application: HSRequirementFunction, selection: HSRequirementFunction};
type Outcomes = Map<string, Map<string, SuccessChance>>;

const updateOutcomes = (state: AppState, reqFnSelector: ReqFnSelector): Outcomes => {
  let outcomes: Outcomes = Map();
  const hsProgramIDs = state.getIn(['hsData', 'hsProgramIDs']);
  const allPrograms = state.getIn(['hsData', 'programs']);
  const index = state.getIn(['hsData', 'index']);

  // FIXME: expensive?  
  const studentData = state.get('studentData').toJS();

  const prevOutcomes = state.getIn(['hsData', 'outcomes']);
  return prevOutcomes.map( (prevOutcome, programID) => {
    if (hsProgramIDs.includes(programID)) {
      const program = selectProgram(programID, allPrograms, index);
      const reqFns = reqFnSelector(program);
      const newOutcome = Map({
        application: reqFns.application(studentData, program).outcome,
        selection: reqFns.selection(studentData, program).outcome
      });
      return newOutcome;
    } else {
      return prevOutcome;
    }
  });
};

// ensures that dependent properties of AppState
//  (ie studentData.gpa, hsData.outcomes) are set
//  correctly based on independent properties of AppState
//  (all others)
const updateDependentProperties = (state: AppState): AppState => {
  const mathGrade = state.getIn(['studentData', 'subjGradeMath']);
  const readGrade = state.getIn(['studentData', 'subjGradeRead']);
  const sciGrade = state.getIn(['studentData', 'subjGradeSci']);
  const socStudiesGrade = state.getIn(['studentData', 'subjGradeSocStudies']);
  const gpa = calculateGPA(mathGrade, readGrade, sciGrade, socStudiesGrade);
  const outcomes = updateOutcomes(state, getReqFns);
  return state.setIn(['studentData', 'gpa'], gpa).setIn(['hsData', 'outcomes'], outcomes);
};

const rootReducer = (state: AppState = initialState, action: Redux.AnyAction): AppState => {

  let nextState: AppState;

  switch(action.type) {
    case ActionType.UpdateStudentGender:
      nextState = state.setIn(['studentData', 'gender'], action.payload);
      break;

    case ActionType.UpdateStudentLocation:
      nextState = state.setIn(['studentData', 'location'], action.payload);
      break;

    case ActionType.UpdateStudentGradeLevel:
      nextState = state.setIn(['studentData', 'gradeLevel'], action.payload);
      break;

    case ActionType.UpdateStudentPrevGradeLevel:
      nextState = state.setIn(['studentData', 'prevGradeLevel'], action.payload);
      break;

    case ActionType.UpdateStudentIEPStatus:
      nextState = state.setIn(['studentData', 'iep'], action.payload);
      break;

    case ActionType.UpdateStudentELLStatus:
      nextState = state.setIn(['studentData', 'ell'], action.payload);
      break;

    case ActionType.UpdateStudentAttendPercentage:
      nextState = state.setIn(['studentData', 'attendancePercentage'], action.payload);
      break;

    // GPA is dependent property

    case ActionType.UpdateStudentCurrESProgram:
      nextState = state.setIn(['studentData', 'currESProgramID'], action.payload);
      break;

    case ActionType.UpdateStudentSiblingHSPrograms:
      nextState = state.setIn(['studentData', 'siblingHSProgramIDs'], action.payload);
      break;

    case ActionType.UpdateStudentSETestPercentile:
      nextState = state.setIn(['studentData', 'seTestPercentile'], action.payload);
      break;

    case ActionType.UpdateStudentNWEAPercentileMath:
      nextState = state.setIn(['studentData', 'nweaPercentileMath'], action.payload);
      break;

    case ActionType.UpdateStudentNWEAPercentileRead:
      nextState = state.setIn(['studentData', 'nweaPercentileRead'], action.payload);
      break;

    case ActionType.UpdateStudentSubjGradeMath:
      nextState = state.setIn(['studentData', 'subjGradeMath'], action.payload);
      break;

    case ActionType.UpdateStudentSubjGradeRead:
      nextState = state.setIn(['studentData', 'subjGradeRead'], action.payload);
      break;

    case ActionType.UpdateStudentSubjGradeSci:
      nextState = state.setIn(['studentData', 'subjGradeSci'], action.payload);
      break;

    case ActionType.UpdateStudentSubjGradeSocStudies:
      nextState = state.setIn(['studentData', 'subjGradeSocStudies'], action.payload);
      break;

    case ActionType.SelectHSProgram:
      nextState = state.set('selectedHSProgramID', action.payload);
      break;

    default:
      console.warn(`No reducer for actiontype ${action.type}`);
      nextState = state;

  }

  const updatedState = updateDependentProperties(nextState);
  console.log(updatedState.toJS());
  return updatedState;
  
};

export default rootReducer;


