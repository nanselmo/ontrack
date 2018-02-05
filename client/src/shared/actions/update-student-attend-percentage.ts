import Action from "shared/enums/action";

const updateStudentAttendPercentage = (newValue: number) => {
  return {
    type: Action.UpdateStudentAttendPercentage,
    payload: newValue
  }
};

export default updateStudentAttendPercentage;
