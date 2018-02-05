import Action from "shared/enums/action";

const updateStudentSubjGradeSocStudies = (newValue: number) => {
  return {
    type: Action.UpdateStudentSubjGradeSocStudies,
    payload: newValue
  };
};

export default updateStudentSubjGradeSocStudies;
