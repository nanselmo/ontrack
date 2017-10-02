import RequirementsFunction from "shared/types/requirements-function";
import LatLongCoordinates from "shared/types/lat-long-coordinates";

interface Highschool {
  shortName: string
  fullName: string
  selectionRequirementsFunction: RequirementsFunction
  coordinates: LatLongCoordinates
  iconUrl: string
  // probably more
}

export default Highschool;

