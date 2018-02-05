import Action from "shared/enums/action";
import Gender from "shared/enums/gender";

const updateStudentGender = (newValue: Gender) => {
  return {
    type: Action.UpdateStudentGender,
    payload: newValue
  }
};

export default updateStudentGender;
