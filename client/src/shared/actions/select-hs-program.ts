import Action from "shared/enums/action";

const selectHSProgram = (newValue: string) => {
  return {
    type: Action.SelectHSProgram,
    payload: newValue
  };
};

export default selectHSProgram;
