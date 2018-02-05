import Action from "shared/enums/action";

const updateStudentNWEAPercentileRead = (newValue: number) => {
  return {
    type: Action.UpdateStudentNWEAPercentileRead,
    payload: newValue
  };
};

export default updateStudentNWEAPercentileRead;
