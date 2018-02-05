import Action from "shared/enums/action";

const updateStudentSubjGradeMath = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeRead,
    payload: newValue
  };
};

export default updateStudentSubjGradeMath;
