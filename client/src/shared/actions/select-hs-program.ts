import Action from "shared/enum/action";

const selectHSProgram = (newValue: string) => {
  return {
    type: Action.SelectHSProgram,
    payload: newValue
  };
};

export default selectHSProgram;
