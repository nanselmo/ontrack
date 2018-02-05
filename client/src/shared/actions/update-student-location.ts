import Action from "shared/enums/action";

const updateStudentLocation = (location: {address: string, tier: string, geo: {latitude: number, longitude: number}}) => {
  return {
    type: Action.UpdateStudentLocation,
    payload: location
  }
};

export default updateStudentLocation;
