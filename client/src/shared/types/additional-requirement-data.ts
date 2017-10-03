interface AdditionalRequirementData {
  name: string
  value: string | null
  validationFunction: (string) => boolean
  incrementValueFunction: (string) => string
  decrementValueFunction: (string) => string
}

export default AdditionalRequirementData;
