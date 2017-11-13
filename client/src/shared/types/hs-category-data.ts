import Highschool from "shared/types/highschool";
import HSRequirementsFunction from "shared/types/hs-requirements-function";

interface HSCategoryData {
  shortName: string
  longName: string
  requirementsFunction: HSRequirementsFunction
  highschools: Highschool[]
}

export default HSCategoryData;
