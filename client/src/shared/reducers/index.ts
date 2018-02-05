import Gender from "shared/enums/gender";
import AppState from "shared/types/app-state";
import Action from "shared/enums/action";

import * as Redux from "redux";

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

  selectedHSProgramID: null
};


const locationReducer = (state: AppState, action: Action.UpdateStudentLocation): AppState => {
  // update address to new address
  // TODO rethink this one ya dingos -- you don't want to be sending the geo request
  //  in the reducer, let alone doing the tier calculation. I like that a loooot better
  //  constrained to one component.
  return state;
};

const rootReducer = (state: AppState = initialState, action: Redux.AnyAction): AppState => {
  switch(action.type) {
    case Action.UpdateStudentGender:
      break;
    case Action.UpdateStudentLocation:
      break;
    case Action.UpdateStudentGradeLevel:
      break;
    case Action.UpdateStudentPrevGradeLevel:
      break;
    case Action.UpdateStudentCurrESProgram:
      break;
    case Action.UpdateStudentIEPStatus:
      break;
    case Action.UpdateStudentELLStatus:
      break;

    case Action.UpdateStudentNWEAPercentileMath:
      break;
    case Action.UpdateStudentNWEAPercentileRead:
      break;
    case Action.UpdateStudentSubjGradeMath:
      break;
    case Action.UpdateStudentSubjGradeRead:
      break;
    case Action.UpdateStudentSubjGradeSci:
      break;
    case Action.UpdateStudentSubjGradeSocStudies:
      break;
    case Action.UpdateStudentSETestScore:
      break;

    case Action.SelectHSProgram:
      break;

    default:
      return state;
  }
};

export default rootReducer;


