import * as React from "react"

import StudentData from "shared/types/student-data";
import CPSProgram from "shared/types/cps-program";
import Gender from "shared/enums/gender";
import StudentLocation from "shared/types/student-location";

import DropdownField from "shared/components/ui/fields/dropdown-field";
import ComboBoxField from "shared/components/ui/fields/combo-box-field";
import MultiSelectField from "shared/components/ui/fields/multi-select-field";
import TextField from "shared/components/ui/fields/text-field";
import NumberField from "shared/components/ui/fields/number-field";
import Limiter from "shared/components/ui/fields/limiter";

import AddressTierCalculator from "./address-tier-calculator";

import "./student-data-form.scss";

interface StudentDataFormProps {
  
  gender: Gender
  location: StudentLocation
  gradeLevel: number
  prevGradeLevel: number
  currESProgramID: string
  ell: boolean
  iep: boolean
  attendancePercentage: number
  gpa: number
  siblingHSProgramIDs: string[]
  seTestPercentile: number
  nweaPercentileMath: number
  nweaPercentileRead: number
  subjGradeMath: number 
  subjGradeRead: number
  subjGradeSci: number
  subjGradeSocStudies: number

  hsPrograms: CPSProgram[]
  esPrograms: CPSProgram[]

  onGenderChange: (gender: Gender) => any
  onLocationChange: (loc: StudentLocation) => any
  onGradeLevelChange: (gradeLevel: number) => any
  onPrevGradeLevelChange: (prevGradeLevel: number) => any
  onCurrESProgramChange: (currESProgramID: string) => any
  onSiblingHSProgramsChange: (siblingHSProgramIDs: string[]) => any
  onELLChange: (ellStatus: boolean) => any
  onIEPChange: (iepStatus: boolean) => any
  onAttendPercentageChange: (attendPercentage: number) => any

  onNWEAPercentileMathChange: (pctile: number) => any
  onNWEAPercentileReadChange: (pctile: number) => any
  onSubjGradeMathChange: (grade: number) => any
  onSubjGradeReadChange: (grade: number) => any
  onSubjGradeSciChange: (grade: number) => any
  onSubjGradeSocStudiesChange: (grade: number) => any

  onSETestPercentileChange: (pctile: number) => any
}


const StudentDataForm = (props: StudentDataFormProps) => {

  const INPUT_DEBOUNCE_TIME = 250; // ms

  const between = (min: number, max: number): Limiter<number> => {
    return (curr: number, next: number): number => {
      if (Number.isNaN(next)) {
        return curr;
      } else if (next < min) {
        return min;
      } else if (next > max) {
        return max; 
      } else {
        return next;
      }
    };
  }

  return (
    <div className="student-data-form">
      <div className="student-data-form-subheader"> 
        Your student information 
      </div>
      <div className="student-data-form-subform">
          <DropdownField
            label="What grade are you in?"
            value={props.gradeLevel.toString()}
            onChange={(gradeStr: string) => props.onGradeLevelChange(parseInt(gradeStr)) }
            debounceTime={INPUT_DEBOUNCE_TIME}
          >
            <option value="4">4th grade</option>
            <option value="5">5th grade</option>
            <option value="6">6th grade</option>
            <option value="7">7th grade</option>
            <option value="8">8th grade</option>
          </DropdownField>
          <DropdownField
            label="What's your gender?"
            value={props.gender.toString()}
            onChange={ (gender: string) => {
              switch(gender) {
                case "male":
                  props.onGenderChange(Gender.MALE);
                  break;
                case "female":
                  props.onGenderChange(Gender.MALE);
                  break;
                case "other":
                  props.onGenderChange(Gender.MALE);
                  break;
                case "noanswer":
                  props.onGenderChange(Gender.MALE);
                  break;
                default:
                  console.warn(`unrecognized gender: ${gender}`);
                  break;
              }
            } }
            debounceTime={INPUT_DEBOUNCE_TIME}
          >
            <option value={"male"}>Boy</option>
            <option value={"female"}>Girl</option>
            <option value={"other"}>Other</option>
            <option value={"noanswer"}>Prefer not to answer</option>
          </DropdownField>

          <DropdownField
            label="Do you have an IEP?"
            value={props.iep ? "true" : "false"}
            onChange={ iep => props.onIEPChange(iep === "true" ? true : false) }
            debounceTime={INPUT_DEBOUNCE_TIME}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </DropdownField>

          <DropdownField
            label="Are you an English Language Learner?"
            value={props.ell ? "true" : "false"}
            onChange={ ell => props.onELLChange(ell === "true" ? true : false) }
            debounceTime={INPUT_DEBOUNCE_TIME}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </DropdownField>

          <ComboBoxField
            label="What elementary school program are you in now?"
            value={props.currESProgramID}
            data={{records: props.esPrograms, getKey: (program) => program.ID, getDisplayText: (program) => program.Short_Name + " - " + program.Program_Type }}
            onChange={ (program: CPSProgram) => props.onCurrESProgramChange(program.ID)}
            debounceTime={INPUT_DEBOUNCE_TIME}
          /> 

          <MultiSelectField
            label="Do you have a sibling in high school? If so, which school?"
            values={props.siblingHSProgramIDs}
            data={{records: props.hsPrograms, getKey: (program) => program.ID, getDisplayText: (program) => program.Short_Name + " - " + program.Program_Type }}
            onChange={ (programs: CPSProgram[]) => props.onSiblingHSProgramsChange(programs.map( program => program.ID ) )}
            debounceTime={INPUT_DEBOUNCE_TIME}
          /> 
          
          <AddressTierCalculator
            location={props.location}
            onLocationChange={props.onLocationChange}
          />

          <NumberField
            label="Your 7th grade attendance percentage"
            value={props.attendancePercentage}
            onChange={props.onAttendPercentageChange}
            limiter={between(0, 100)}
            debounceTime={INPUT_DEBOUNCE_TIME}
          />
      </div>

      <div className="student-data-form-subheader">
        Your grades
      </div>
      <div className="student-data-form-subform">

        <NumberField
          label="NWEA Math percentile"
          value={props.nweaPercentileMath}
          onChange={props.onNWEAPercentileMathChange}
          limiter={between(1, 99)}
          debounceTime={INPUT_DEBOUNCE_TIME}
        />

        <NumberField
          label="NWEA Reading percentile"
          value={props.nweaPercentileRead}
          onChange={props.onNWEAPercentileReadChange}
          limiter={between(1, 99)}
          debounceTime={INPUT_DEBOUNCE_TIME}
        />

        <NumberField
          label="Your Math grade"
          value={props.subjGradeMath}
          onChange={props.onSubjGradeMathChange}
          limiter={between(0, 100)}
          debounceTime={INPUT_DEBOUNCE_TIME}
        />

        <NumberField
          label="Your Reading grade"
          value={props.subjGradeRead}
          onChange={props.onSubjGradeReadChange}
          limiter={between(0, 100)}
          debounceTime={INPUT_DEBOUNCE_TIME}
        />

        <NumberField
          label="Your Science grade"
          value={props.subjGradeSci}
          onChange={props.onSubjGradeSciChange}
          limiter={between(0, 100)}
          debounceTime={INPUT_DEBOUNCE_TIME}
        />

        <NumberField
          label="Your Social Studies grade"
          value={props.subjGradeSocStudies}
          onChange={props.onSubjGradeSocStudiesChange}
          limiter={between(0, 100)}
          debounceTime={INPUT_DEBOUNCE_TIME}
        />

        <NumberField
          label="Your Selective Enrollment test percentile"
          value={props.seTestPercentile}
          onChange={props.onSETestPercentileChange}
          limiter={between(1, 99)}
          debounceTime={INPUT_DEBOUNCE_TIME}
        />
      </div>
    </div>
  );
};

export default StudentDataForm;
