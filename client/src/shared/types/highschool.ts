import RequirementsFunction from "shared/types/requirements-function";
import LatLongCoordinates from "shared/types/lat-long-coordinates";

interface Highschool {
  shortName: string
  longName: string
  initials: string
  selectionRequirementsFunction: RequirementsFunction
  applicationRequirementsFunction: RequirementsFunction
  coordinates: LatLongCoordinates
  iconUrl?: string
  // probably more
}

export default Highschool;

