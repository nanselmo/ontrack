import * as React from "react"

import StudentData from "shared/types/student-data";
import {StudentDataFormStrings as strings} from "shared/l10n/strings";
import {cloneAndExtend} from "shared/util/clone";
import ScoreType from "shared/enums/score-type";
import ValidationState from "shared/enums/validation-state";

import {scoreToString, tryParseScore} from "shared/util/grade-convert";

import DropdownInput from "shared/components/ui/dropdown-input";
import ComboBoxInput from "shared/components/ui/combo-box-input";
import TextInput from "shared/components/ui/text-input";
import NumberInput from "shared/components/ui/number-input";

import AddressTierCalculator from "./address-tier-calculator";

import "./student-data-form.scss";

interface StudentDataFormProps {
  studentData: StudentData | null
  onChange: (data: StudentData) => any
}

const StudentDataForm = (props: StudentDataFormProps) => {


  const validateNWEAPercentile = (pct: number): ValidationState => {
    if (pct >= 1 && pct <= 99) {
      return ValidationState.VALID;
    } else {
      return ValidationState.INVALID;
    }
  };

  const validateSubjGrade = (grade: number): ValidationState => {
    if (grade >= 0 && grade <= 100) {
      return ValidationState.VALID;
    } else {
      return ValidationState.INVALID;
    }
  };

  const updateStudentData = (prop: string, value: string | boolean): void => {
    if (props.studentData[prop] !== value) {
      const newStudentData = cloneAndExtend(props.studentData, {[prop]: value});
      props.onChange(newStudentData);
    }
  };

  const updateStudentScores = (prop: string, value: number): void => {
    if (props.studentData.scores[prop] !== value) {
      const newStudentScores = cloneAndExtend(props.studentData.scores, {[prop]: value}); 
      const newStudentData = cloneAndExtend(props.studentData, newStudentScores);
      props.onChange(newStudentData);
    }
  };

  // NOTE to refactor into smaller components, we'll need:
  // - text input
  // - dropdown input
  // - combo box input
  // - number input
  // common props:
  //  - value:
  //  - onChange:
  //  - placeholder:
  //  - label:
  //  - validator:
  // dropdown / combo box:
  //  - options
  

  return (
    <div className="student-data-form">
      <div className="student-data-form-subheader"> 
        Your student information 
      </div>
      <TextInput
        placeholder="Your first name..."
        value={props.studentData.studentFirstName}
        onChange={fname => updateStudentData("studentFirstName", fname)}
      />
      <TextInput
        placeholder="Your last name..."
        value={props.studentData.studentLastName}
        onChange={lname => updateStudentData("studentLastName", lname)}
      />
      <DropdownInput
        label="What grade are you in?"
        value={props.studentData.gradeLevel.toString()}
        onChange={grade => updateStudentData("gradeLevel", grade)}
      >
          <option value="4">4th grade</option>
          <option value="5">5th grade</option>
          <option value="6">6th grade</option>
          <option value="7">7th grade</option>
          <option value="8">8th grade</option>
      </DropdownInput>

      <DropdownInput
        label="Do you have an IEP?"
        value={props.studentData.iep ? "true" : "false"}
        onChange={iep => updateStudentData("iep", iep)}
      >
          <option value="true">Yes</option>
          <option value="false">No</option>
      </DropdownInput>

      <DropdownInput
        label="Are you an English Language Learner?"
        value={props.studentData.ell ? "true" : "false"}
        onChange={ell => updateStudentData("ell", ell)}
      >
          <option value="true">Yes</option>
          <option value="false">No</option>
      </DropdownInput>
      
      // TODO geolocate address
      <AddressTierCalculator
        address={props.studentData.address}
        tier={props.studentData.tier}
        onAddressChange={address => updateStudentData("address", address)}
        onTierChange={tier => updateStudentData("tier", tier)}
      />

      <div className="student-data-form-subheader">
        Your most recent grades
      </div>
      
      <NumberInput
        label="NWEA Math percentile"
        value={props.studentData.scores.nweaPercentileMath}
        onChange={nweaPercentileMath => updateStudentScores("nweaPercentileMath", nweaPercentileMath)}
        validationState={validateNWEAPercentile(props.studentData.scores.nweaPercentileMath)}
      />
      <NumberInput
        label="NWEA Reading percentile"
        value={props.studentData.scores.nweaPercentileRead}
        onChange={nweaPercentileRead => updateStudentScores("nweaPercentileRead", nweaPercentileRead)}
        validationState={validateNWEAPercentile(props.studentData.scores.nweaPercentileRead)}
      />
      <NumberInput
        label="Your Math grade"
        value={props.studentData.scores.subjGradeMath}
        onChange={subjGradeMath => updateStudentScores("subjGradeMath", subjGradeMath)}
        validationState={validateSubjGrade(props.studentData.scores.subjGradeMath)}
      />
      <NumberInput
        label="Your Reading grade"
        value={props.studentData.scores.subjGradeRead}
        onChange={subjGradeRead => updateStudentScores("subjGradeRead", subjGradeRead)}
        validationState={validateSubjGrade(props.studentData.scores.subjGradeRead)}
      />
      <NumberInput
        label="Your Science grade"
        value={props.studentData.scores.subjGradeSci}
        onChange={subjGradeSci => updateStudentScores("subjGradeSci", subjGradeSci)}
        validationState={validateSubjGrade(props.studentData.scores.subjGradeSci)}
      />
      <NumberInput
        label="Your Social Studies grade"
        value={props.studentData.scores.subjGradeSocStudies}
        onChange={subjGradeSocStudies => updateStudentScores("subjGradeSocStudies", subjGradeSocStudies)}
        validationState={validateSubjGrade(props.studentData.scores.subjGradeSocStudies)}
      />
      
    </div>
  );
}

export default StudentDataForm;
