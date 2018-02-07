import ActionType from "shared/enums/action-type";
import Gender from "shared/enums/gender";
import StudentLocation from "shared/types/student-location";
import ScoreType from "shared/types/score-type";


export const selectHSProgram = (newValue: string) => {
  return {
    type: ActionType.SelectHSProgram,
    payload: newValue
  };
};

export const updateStudentAttendPercentage = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentAttendPercentage,
    payload: newValue
  }
};

export const updateStudentELLStatus = (newValue: boolean) => {
  return {
    type: ActionType.UpdateStudentELLStatus,
    payload: newValue
  }
};

export const updateStudentGender = (newValue: Gender) => {
  return {
    type: ActionType.UpdateStudentGender,
    payload: newValue
  }
};

export const updateStudentGradeLevel = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentGradeLevel,
    payload: newValue
  }
};

export const updateStudentPrevGradeLevel = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentPrevGradeLevel,
    payload: newValue
  }
};

export const updateStudentIEPStatus = (newValue: boolean) => {
  return {
    type: ActionType.UpdateStudentIEPStatus,
    payload: newValue
  }
};

export const updateStudentLocation = (location: StudentLocation) => {
  return {
    type: ActionType.UpdateStudentLocation,
    payload: location
  }
};

export const updateStudentCurrESProgram = (newValue: string) => {
  return {
    type: ActionType.UpdateStudentCurrESProgram,
    payload: newValue 
  }
};

export const updateStudentSiblingHSPrograms = (newValues: string[]) => {
  return {
    type: ActionType.UpdateStudentSiblingHSPrograms,
    payload: newValues
  }
};

export const updateStudentNWEAPercentileMath = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentNWEAPercentileMath,
    payload: newValue
  };
};

export const updateStudentNWEAPercentileRead = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentNWEAPercentileRead,
    payload: newValue
  };
};

export const updateStudentSubjGradeMath = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentSubjGradeMath,
    payload: newValue
  };
};

export const updateStudentSubjGradeRead = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentSubjGradeRead,
    payload: newValue
  };
};

export const updateStudentSubjGradeSci = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentSubjGradeSci,
    payload: newValue
  };
};

export const updateStudentSubjGradeSocStudies = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentSubjGradeSocStudies,
    payload: newValue
  };
};

export const updateStudentSETestPercentile = (newValue: number) => {
  return {
    type: ActionType.UpdateStudentSETestPercentile,
    payload: newValue
  }
};

export const updateStudentScore = (scoreType: ScoreType, newValue: number) => {
  let actionType;
  switch(scoreType) {
    case "nweaPercentileMath":
      actionType = ActionType.UpdateStudentNWEAPercentileMath;
      break;
    case "nweaPercentileRead" :
      actionType = ActionType.UpdateStudentNWEAPercentileRead;
      break;
    case "subjGradeMath" :
      actionType = ActionType.UpdateStudentSubjGradeMath;
      break;
    case "subjGradeRead" :
      actionType = ActionType.UpdateStudentSubjGradeRead;
      break;
    case "subjGradeSci" :
      actionType = ActionType.UpdateStudentSubjGradeSci;
      break;
    case "subjGradeSocStudies":
      actionType = ActionType.UpdateStudentSubjGradeSocStudies;
      break;
    case "seTestPercentile":
      actionType = ActionType.UpdateStudentSETestPercentile;
    default:
      throw new Error(`Unrecognized ScoreType: ${scoreType}`);
  }
  return {
    type: actionType,
    payload: newValue
  };
}
