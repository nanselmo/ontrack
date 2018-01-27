import * as React from "react"

import StudentData from "shared/types/student-data";
import CPSProgram from "shared/types/cps-program";
import {StudentDataFormStrings as strings} from "shared/l10n/strings";
import {cloneAndExtend} from "shared/util/clone";
import ScoreType from "shared/enums/score-type";
import ValidationState from "shared/enums/validation-state";
import Gender from "shared/enums/gender";

import {scoreToString, tryParseScore} from "shared/util/grade-convert";

import DropdownField from "shared/components/ui/fields/dropdown-field";
import ComboBoxField from "shared/components/ui/fields/combo-box-field";
import getKey from "shared/components/ui/fields/get-key";
import TextField from "shared/components/ui/fields/text-field";
import NumberField from "shared/components/ui/fields/number-field";

import AddressTierCalculator from "./address-tier-calculator";

import {getESPrograms, getHSPrograms} from "shared/util/data-access";
const alphaSort = (a: CPSProgram, b: CPSProgram) => {
  if (a.Short_Name < b.Short_Name) {
    return -1;
  } else if (a.Short_Name === b.Short_Name) {
    return 0;
  } else if (a.Short_Name > b.Short_Name) {
    return 1;
  }
};
const esPrograms: Array<CPSProgram> = getESPrograms().sort( alphaSort );
const hsPrograms: Array<CPSProgram> = getHSPrograms().sort( alphaSort );

import "./student-data-form.scss";

interface StudentDataFormProps {
  studentData: StudentData
  onChange: (data: StudentData) => any
}

const StudentDataForm = (props: StudentDataFormProps) => {

  console.log(props.studentData.currESProgram);

  const isValidGradeLevel = (gradeLevel: number) => {
    return !Number.isNaN(gradeLevel) && gradeLevel >= 4 && gradeLevel <= 8;
  };

  const isValidNweaPercentile = (pctile: number) => {
    return !Number.isNaN(pctile) && pctile >= 1 && pctile <= 99;
  };

  const isValidSubjGrade = (grade: number) => {
    return !Number.isNaN(grade) && grade >= 0 && grade <= 100;
  };

  const isValidAttendPercentage = (attendPct: number) => {
    return !Number.isNaN(attendPct) && attendPct >= 0 && attendPct <= 100;
  };

  const isValidSETestPercentile = (pctile: number) => {
    return !Number.isNaN(pctile) && pctile >= 1 && pctile <= 99;
  }

  const validateNWEAPercentile = (pct: number): ValidationState => {
    if (isValidNweaPercentile(pct)) {
      return ValidationState.VALID;
    } else {
      return ValidationState.INVALID;
    }
  };

  const validateSubjGrade = (grade: number): ValidationState => {
    if (isValidSubjGrade(grade)) {
      return ValidationState.VALID;
    } else {
      return ValidationState.INVALID;
    }
  };

  const updateStudentData = (prop: string, value: any): void => {
    console.log(`${prop}: ${value}`);
    if (props.studentData[prop] !== value) {
      const newStudentData = cloneAndExtend(props.studentData, {[prop]: value});
      props.onChange(newStudentData);
    }
  };

  const updateStudentScores = (prop: string, value: number): void => {
    if (props.studentData.scores[prop] !== value) {
      const newStudentScores = cloneAndExtend(props.studentData.scores, {[prop]: value}); 
      const newStudentData = cloneAndExtend(props.studentData, {scores: newStudentScores});
      props.onChange(newStudentData);
    }
  };

  const toOptions = (program: CPSProgram) => {
    return {
      value: program.ID,
      text: `${program.Short_Name} - ${program.Program_Type}`
    }
  };

  console.log(props.studentData);
  return (
    <div className="student-data-form">
      <div className="student-data-form-subheader"> 
        Your student information 
      </div>
      <TextField
        placeholder="Your first name..."
        value={props.studentData.studentFirstName}
        onChange={fname => updateStudentData("studentFirstName", fname)}
      />
      <TextField
        placeholder="Your last name..."
        value={props.studentData.studentLastName}
        onChange={lname => updateStudentData("studentLastName", lname)}
      />
      <DropdownField
        label="What grade are you in?"
        value={props.studentData.gradeLevel.toString()}
        onChange={grade => {
          if (isValidGradeLevel(parseInt(grade))) {
            updateStudentData("gradeLevel", grade)
          }
        } }
      >
        <option value="4">4th grade</option>
        <option value="5">5th grade</option>
        <option value="6">6th grade</option>
        <option value="7">7th grade</option>
        <option value="8">8th grade</option>
      </DropdownField>
      <DropdownField
        label="What's your gender?"
        value={props.studentData.gender.toString()}
        onChange={gender => updateStudentData("gender", gender)}
      >
        <option value={Gender.MALE.toString()}>Boy</option>
        <option value={Gender.FEMALE.toString()}>Girl</option>
        <option value={Gender.OTHER.toString()}>Other</option>
        <option value={Gender.NOANSWER.toString()}>Prefer not to answer</option>
      </DropdownField>

      <DropdownField
        label="Do you have an IEP?"
        value={props.studentData.iep ? "true" : "false"}
        onChange={iep => updateStudentData("iep", iep === "true" ? true : false)}
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </DropdownField>

      <DropdownField
        label="Are you an English Language Learner?"
        value={props.studentData.ell ? "true" : "false"}
        onChange={ell => updateStudentData("ell", ell === "true" ? true : false)}
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </DropdownField>

      {/* TODO -- rethink this whole thing... ideally, need to return key/value pair
        without introducing tight coupling between the comboBox component and the parent
        using it*/}
      <ComboBoxField
        label="What elementary school program are you in now?"
        value={props.studentData.currESProgram}
        data={{records: esPrograms, getKey: (program) => program.ID, getDisplayText: (program) => program.Short_Name + program.Program_Type }}
        onChange={currESProgram => updateStudentData("currESProgram", currESProgram)}
      /> 

      {/* Fixme: only works for one of many possible high schools
        * Solution: MultiSelectComboBoxInput? 
        */}
      <ComboBoxField
        label="Do you have a sibling in high school? If so, which school?"
        value={props.studentData.siblingHSPrograms[0]}
        data={{records: hsPrograms, getKey: (program) => program.ID, getDisplayText: (program) => program.Short_Name + program.Program_Type }}
        onChange={siblingHSProgram => updateStudentData("siblingHSPrograms", [getKey(siblingHSProgram)])}
      /> 
      
      <AddressTierCalculator
        address={props.studentData.address}
        tier={props.studentData.tier}
        geolocation={props.studentData.geolocation}
        onAddressChange={address => updateStudentData("address", address)}
        onTierChange={tier => updateStudentData("tier", tier)}
        onGeolocationChange={geolocation => updateStudentData("geolocation", geolocation)}
      />

      <NumberField
        label="Your 7th grade attendance percentage"
        value={props.studentData.attendancePercentage.toString()}
        onChange={attendancePercentage => {
          updateStudentData("attendancePercentage", attendancePercentage);
        }}
      />

      {/*
      <div className="student-data-form-subheader">
        Your grades
      </div>

      <NumberInput
        label="NWEA Math percentile"
        value={props.studentData.scores.nweaPercentileMath}
        max={1}
        min={99}
        onChange={nweaPercentileMath => {
          updateStudentScores("nweaPercentileMath", nweaPercentileMath);
        }}
       validationState={validateNWEAPercentile(props.studentData.scores.nweaPercentileMath)}
      />

      <NumberInput
        label="NWEA Reading percentile"
        value={props.studentData.scores.nweaPercentileRead}
        max={1}
        min={99}
        onChange={nweaPercentileRead => {
          updateStudentScores("nweaPercentileRead", nweaPercentileRead);
        }}                                                                                                                                    
        validationState={validateNWEAPercentile(props.studentData.scores.nweaPercentileRead)}
      />

      <NumberInput
        label="Your Math grade"
        value={props.studentData.scores.subjGradeMath}
        max={0}
        min={100}
        onChange={subjGradeMath => {
          updateStudentScores("subjGradeMath", subjGradeMath);
        }}                                                                                                                                    
        validationState={validateSubjGrade(props.studentData.scores.subjGradeMath)}
      />

      <NumberInput
        label="Your Reading grade"
        value={props.studentData.scores.subjGradeRead}
        max={0}
        min={100}
        onChange={subjGradeRead => {
          updateStudentScores("subjGradeRead", subjGradeRead);
        }}                                                                                                                                    
        validationState={validateSubjGrade(props.studentData.scores.subjGradeRead)}
      />

      <NumberInput
        label="Your Science grade"
        value={props.studentData.scores.subjGradeSci}
        max={0}
        min={100}
        onChange={subjGradeSci => {
          updateStudentScores("subjGradeSci", subjGradeSci);
        }}                                                                                                                                    
        validationState={validateSubjGrade(props.studentData.scores.subjGradeSci)}
      />

      <NumberInput
        label="Your Social Studies grade"
        value={props.studentData.scores.subjGradeSocStudies}
        max={0}
        min={100}
        onChange={subjGradeSocStudies => {
          updateStudentScores("subjGradeSocStudies", subjGradeSocStudies);
        }}                                                                                                                                    
        validationState={validateSubjGrade(props.studentData.scores.subjGradeSocStudies)}
      />

      <NumberInput
        label="Your Selective Enrollment test percentile"
        value={props.studentData.seTestPercentile}
        max={1}
        min={99}
        onChange={seTestPercentile => {
          updateStudentData("seTestPercentile", seTestPercentile);
        }}                                                                                                                                    
        validationState={validateSubjGrade(props.studentData.scores.subjGradeSocStudies)}
      />
        */}

      
    </div>
  );
}

export default StudentDataForm;
