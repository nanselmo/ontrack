import HSRequirementsFunction from "shared/types/hs-requirements-function";
import LatLongCoordinates from "shared/types/lat-long-coordinates";

interface Highschool {
  shortName: string
  longName: string
  initials: string
  selectionRequirementsFunction: HSRequirementsFunction
  applicationRequirementsFunction: HSRequirementsFunction
  coordinates?: LatLongCoordinates
  iconUrl?: URL 
  previewUrl?: URL
  // probably more
}

export default Highschool;

