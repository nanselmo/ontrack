import * as React from "react"

import StudentData from "shared/types/student-data";
import {StudentDataFormStrings as strings} from "shared/l10n/strings";
import {cloneAndExtend} from "shared/util/clone";
import ScoreType from "shared/enums/score-type";

import {scoreToString, tryParseScore} from "shared/util/grade-convert";

import {Form, FormGroup, FormControl, ControlLabel} from "react-bootstrap";

import AddressTierCalculator from "./address-tier-calculator";

import "./student-data-form.scss";

interface StudentDataFormProps {
  studentData: StudentData | null
  onChange: (data: StudentData) => any
}

enum ValidationResponse {
  Success = "success",
  Warn = "warning",
  Err = "error"
}

const StudentDataForm = (props: StudentDataFormProps) => {

  const createChangeHandler = (property: string) =>  {
    return (value: string) => {
      const newStudentData = cloneAndExtend(props.studentData, {[property]:value});
      props.onChange(newStudentData);
    }
  };

  const validateScore = (score: string, scoreType: ScoreType): ValidationResponse => {
    const [success, parsedScore] = tryParseScore(score, scoreType);
    if (success) {
      return ValidationResponse.Success;
    } else {
      return ValidationResponse.Err;
    }
  };

  const isNotEmpty = (value: string): ValidationResponse => {
    if (value.length > 0) {
      return ValidationResponse.Success;
    } else {
      return ValidationResponse.Err;
    }
  };

  const isNotNull = (value: any): ValidationResponse => {
    if (value !== null) {
      return ValidationResponse.Success;
    } else {
      return ValidationResponse.Err;
    }
  };

  return (
    <div className="student-data-form">
      <div className="student-data-form-subheader"> 
        Your student information 
      </div>
      <div className="form-group">
        <Form inline>
          <FormGroup
            controlId="studentFirstName"
            validationState={isNotEmpty(props.studentData.studentFirstName)} >
            <ControlLabel>First Name</ControlLabel>
            {' '}
            <FormControl
              type="text"
              defaultValue={props.studentData.studentFirstName}
              placeholder="Your first name..."
            />
          </FormGroup>
          {'  '}
          <FormGroup controlId="studentLastName"
            validationState={isNotEmpty(props.studentData.studentLastName)} >
            <ControlLabel>Last Name</ControlLabel>
            {' '}
            <FormControl
              type="text"
              defaultValue={props.studentData.studentFirstName}
              placeholder="Your last name..."
            />
          </FormGroup>
        </Form>

        <Form inline>
          <FormGroup controlId="iep">
            <ControlLabel>Do you have an IEP?</ControlLabel>
          {'  '}
            <FormControl
              componentClass="select"
              placeholder="Choose one..."
              defaultValue={props.studentData.iep ? "true" : "false"}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FormControl>

          </FormGroup>
          {'  '}
          <FormGroup controlId="ell">
            <ControlLabel>Are you an English Language Learner?</ControlLabel>
          {'  '}
            <FormControl
              componentClass="select"
              placeholder="Choose one..."
              defaultValue={props.studentData.ell ? "true" : "false"}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FormControl>
          </FormGroup>
        </Form>

        <AddressTierCalculator
          address={props.studentData.address}
          tier={props.studentData.tier}
          onAddressChange={createChangeHandler("address")}
          onTierChange={createChangeHandler("tier")}
        />
      </div>

      <div className="student-data-form-subheader">
        Your most recent grades
      </div>
      <div className="form-group">
        <div className="form-group-row">
          <div className="form-wrapper">
            <FormGroup controlId="nweaMath"
              validationState={isNotNull(props.studentData.scores.nweaMath)} >
              <ControlLabel>NWEA Math RIT Score</ControlLabel>
              <FormControl
                type="number"
                defaultValue={scoreToString(props.studentData.scores.nweaMath, ScoreType.nweaMath)}
              />
            </FormGroup>
          </div>
          <div className="form-wrapper">
            <FormGroup controlId="nweaRead"
              validationState={isNotNull(props.studentData.scores.nweaRead)} >
              <ControlLabel>NWEA Reading RIT Score</ControlLabel>
              <FormControl
                type="number"
                defaultValue={scoreToString(props.studentData.scores.nweaRead, ScoreType.nweaRead)}
              />
            </FormGroup>
          </div>
        </div>
        <div className="form-group-row">
          <div className="form-wrapper">
            <FormGroup controlId="subjGradeMath"
              validationState={isNotNull(props.studentData.scores.subjGradeMath)} >
              <ControlLabel>Your Math grade</ControlLabel>
              <FormControl
                type="number"
                defaultValue={scoreToString(props.studentData.scores.subjGradeMath, ScoreType.subjGradeMath)}
              />
            </FormGroup>
          </div>
          <div className="form-wrapper">
            <FormGroup controlId="subjGradeRead"
              validationState={isNotNull(props.studentData.scores.subjGradeRead)} >
              <ControlLabel>Your Reading grade</ControlLabel>
              <FormControl
                type="number"
                defaultValue={scoreToString(props.studentData.scores.subjGradeRead, ScoreType.subjGradeRead)}
              />
            </FormGroup>
          </div>
          <div className="form-wrapper">
            <FormGroup controlId="subjGradeSci"
              validationState={isNotNull(props.studentData.scores.subjGradeSci)} >
              <ControlLabel>Your Science grade</ControlLabel>
              <FormControl
                type="number"
                defaultValue={scoreToString(props.studentData.scores.subjGradeSci, ScoreType.subjGradeSci)}
              />
            </FormGroup>
          </div> 
          <div className="form-wrapper">
            <FormGroup controlId="subjGradeSocStudies"
              validationState={isNotNull(props.studentData.scores.subjGradeSocStudies)} >
              <ControlLabel>Your Social Studies grade</ControlLabel>
              <FormControl
                type="number"
                defaultValue={scoreToString(props.studentData.scores.subjGradeSocStudies, ScoreType.subjGradeSocStudies)}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDataForm;
