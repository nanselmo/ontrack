import Action from "shared/enums/action";

const updateStudentSubjGradeSci = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeSci,
    payload: newValue
  };
};

export default updateStudentSubjGradeSci;
