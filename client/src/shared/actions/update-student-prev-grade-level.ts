import Action from "shared/enums/action";

const updateStudentPrevGradeLevel = (newValue: number) => {
  return {
    type: Action.UpdateStudentPrevGradeLevel,
    payload: newValue
  }
};

export default updateStudentPrevGradeLevel;
