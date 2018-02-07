import AppState from "shared/types/app-state";
import Gender from "shared/enums/gender";
import { Map } from  "immutable";

import { 
  createIndexByID, 
  getHSProgramIDs, 
  getESProgramIDs, 
  getHSProgramIDsByType,
  initializeOutcomes,
} from "./reducer-utils";

import {getAllPrograms} from "shared/util/data-access";
const allPrograms = getAllPrograms();


const initialState: AppState = Map({ 
  studentData: {
    gender: Gender.NOANSWER,
    location: {
      address: "",
      tier: "",
      geo: {latitude: 0, longitude: 0},
    },
    gradeLevel: 0,
    prevGradeLevel: 0,
    iep: false,
    ell: false,
    attendancePercentage: 0,
    gpa: 0,

    currESProgramID: undefined,
    siblingHSProgramIDs: undefined,
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
});

// wrap in immutablejs
export default initialState;
