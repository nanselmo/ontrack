import Action from "shared/enums/action";

const updateStudentGradeLevel = (newValue: number) => {
  return {
    type: Action.UpdateStudentGradeLevel,
    payload: newValue
  }
};

export default updateStudentGradeLevel;
