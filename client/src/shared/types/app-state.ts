import StudentData from "shared/types/student-data";
import CPSProgram from "shared/types/cps-program";
import SuccessChance from "shared/enums/success-chance";

import ImmutableMap from "shared/types/immutable-map";


interface AppStateShape {
  
  studentData: ImmutableMap<StudentData>

  hsData: ImmutableMap<{
    programs: CPSProgram[]
    index: {[id: string]: number}
    hsProgramIDs: string[]
    esProgramIDs: string[]
    hsProgramIDsByType: {[type: string]: string[]}

    outcomes: {
      [id: string]: {
        application: SuccessChance
        selection: SuccessChance
      }
    }
  }>

  // HS list
  selectedHSProgramID: string | null
}

type AppState = ImmutableMap<AppStateShape>
export default AppState;
