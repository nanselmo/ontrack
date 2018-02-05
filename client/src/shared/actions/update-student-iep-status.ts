import Action from "shared/enums/action";

const updateStudentIEPStatus = (newValue: boolean) => {
  return {
    type: Action.UpdateStudentIEPStatus,
    payload: newValue
  }
};

export default updateStudentIEPStatus;
