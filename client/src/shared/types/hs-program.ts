import SuccessChance from "shared/enums/success-chance";

interface HSProgram {
  id: string
  shortname: string
  longname: string
  programType: string

  cpsLink: string
  hsBoundLink: string
  schoolPageLink: string

  applicationReqDescription: string
  selectionReqDescription: string

  applicationOutcome: SuccessChance
  selectionOutcome: SuccessChance
}

export default HSProgram;
