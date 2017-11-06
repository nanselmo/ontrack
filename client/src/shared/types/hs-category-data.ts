import Highschool from "shared/types/highschool";
import HSRequirementsFunction from "shared/types/hs-requirements-function";
import AdditionalRequirementData from "shared/types/additional-requirement-data";


interface HSCategoryData {
  shortName: string
  longName: string
  requirementsFunction: HSRequirementsFunction
  highschools: Highschool[]
  additionalRequirements: AdditionalRequirementData[]
}

export default HSCategoryData;
