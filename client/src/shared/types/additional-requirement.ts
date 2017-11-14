interface AdditionalRequirement {
  displayName: string,
  desc: string,
  links: URL[],
  hasNumericInput: boolean,
  inputValue?: number,
}

export default AdditionalRequirement;
