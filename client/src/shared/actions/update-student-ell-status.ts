import Action from "shared/enums/action";

const updateStudentELLStatus = (newValue: boolean) => {
  return {
    type: Action.UpdateStudentELLStatus,
    payload: newValue
  }
};

export default updateStudentELLStatus;
