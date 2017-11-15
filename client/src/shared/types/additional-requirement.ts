interface AdditionalRequirement {
  displayName: string,
  desc: string,
  links: URL[],
  hasNumericInput: boolean,
  inputValue?: number,
  inputValidationFn?: (value: number) => boolean
}

export default AdditionalRequirement;
