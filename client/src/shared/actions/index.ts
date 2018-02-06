import Action from "shared/enums/action";
import Gender from "shared/enums/gender";
import StudentLocation from "shared/types/student-location";

export const selectHSProgram = (newValue: string) => {
  return {
    type: Action.SelectHSProgram,
    payload: newValue
  };
};

export const updateStudentAttendPercentage = (newValue: number) => {
  return {
    type: Action.UpdateStudentAttendPercentage,
    payload: newValue
  }
};

export const updateStudentELLStatus = (newValue: boolean) => {
  return {
    type: Action.UpdateStudentELLStatus,
    payload: newValue
  }
};

export const updateStudentGender = (newValue: Gender) => {
  return {
    type: Action.UpdateStudentGender,
    payload: newValue
  }
};

export const updateStudentGradeLevel = (newValue: number) => {
  return {
    type: Action.UpdateStudentGradeLevel,
    payload: newValue
  }
};

export const updateStudentPrevGradeLevel = (newValue: number) => {
  return {
    type: Action.UpdateStudentPrevGradeLevel,
    payload: newValue
  }
};

export const updateStudentIEPStatus = (newValue: boolean) => {
  return {
    type: Action.UpdateStudentIEPStatus,
    payload: newValue
  }
};

export const updateStudentLocation = (location: StudentLocation) => {
  return {
    type: Action.UpdateStudentLocation,
    payload: location
  }
};

export const updateStudentCurrESProgram = (newValue: string) => {
  return {
    type: Action.UpdateStudentCurrESProgram,
    payload: newValue 
  }
};

export const updateStudentSiblingHSPrograms = (newValues: string[]) => {
  return {
    type: Action.UpdateStudentSiblingHSPrograms,
    payload: newValues
  }
};

export const updateStudentNWEAPercentileMath = (newValue: number) => {
  return {
    type: Action.UpdateStudentNWEAPercentileMath,
    payload: newValue
  };
};

export const updateStudentNWEAPercentileRead = (newValue: number) => {
  return {
    type: Action.UpdateStudentNWEAPercentileRead,
    payload: newValue
  };
};

export const updateStudentSubjGradeMath = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeRead,
    payload: newValue
  };
};

export const updateStudentSubjGradeRead = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeRead,
    payload: newValue
  };
};

export const updateStudentSubjGradeSci = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeSci,
    payload: newValue
  };
};

export const updateStudentSubjGradeSocStudies = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeSocStudies,
    payload: newValue
  };
};
