import Highschool from "shared/types/highschool";
import AdditionalRequirements from "shared/types/additional-requirements";
import HSRequirementsFunction from "shared/types/hs-requirements-function";

interface HSCategoryData {
  shortName: string
  longName: string
  requirementsFunction: HSRequirementsFunction
  highschools: Highschool[]
  additionalRequirements: AdditionalRequirements,
}

export default HSCategoryData;
