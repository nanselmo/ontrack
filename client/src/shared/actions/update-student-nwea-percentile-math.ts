import Action from "shared/enums/action";

const updateStudentNWEAPercentileMath = (newValue: number) => {
  return {
    type: Action.UpdateStudentNWEAPercentileMath,
    payload: newValue
  };
};

export default updateStudentNWEAPercentileMath;
