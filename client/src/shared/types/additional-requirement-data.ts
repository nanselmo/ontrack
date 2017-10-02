interface AdditionalRequirementData {
  name: string
  validationFunction: (string) => boolean
  incrementValueFunction: (string) => string
  decrementValueFunction: (string) => string
}

export default AdditionalRequirementData;
