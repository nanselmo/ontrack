import Action from "shared/enums/action";

const updateStudentSubjGradeRead = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeRead,
    payload: newValue
  };
};

export default updateStudentSubjGradeRead;
