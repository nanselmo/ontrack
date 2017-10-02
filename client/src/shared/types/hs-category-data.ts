import Highschool from "shared/types/highschool";
import RequirementsFunction from "shared/types/requirements-function";
import AdditionalRequirementData from "shared/types/additional-requirement-data";


interface HSCategoryData {
  shortName: string
  longName: string
  requirementsFunction: RequirementsFunction
  highschools: Highschool[]
  additionalRequirements: AdditionalRequirementData[]
}

export default HSCategoryData;
