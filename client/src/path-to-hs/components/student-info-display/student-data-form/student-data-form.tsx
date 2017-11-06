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
    return (event: React.KeyboardEvent<any>) => {
      const value: string = event.currentTarget.value;
      let newStudentData: StudentData;
      if (property === "gradeLevel"){
        const newScore = Number.parseInt(value, 10);
        newStudentData = cloneAndExtend(props.studentData, {[property]: newScore});
      } else if (property === "ell" || property === "iep") {
        const newValue = value === "true" ? true : false;
        newStudentData = cloneAndExtend(props.studentData, {[property]: newValue});
      } else {
        newStudentData = cloneAndExtend(props.studentData, {[property]: value});
      }
      props.onChange(newStudentData);
    }
  };

  const createScoreChangeHandler = (property: string) => {
    return (event: React.KeyboardEvent<any>) => {
      const value:string = event.currentTarget.value;
      const newScore = Number.parseInt(value, 10);
      const newScores = cloneAndExtend(props.studentData.scores, {[property]: newScore});
      const newStudentData = cloneAndExtend(props.studentData, {scores: newScores});
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
              onChange={createChangeHandler("studentFirstName")}
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
              onChange={createChangeHandler("studentLastName")}
            />
          </FormGroup>
        </Form>

        <Form inline>
          <FormGroup controlId="studentGradeLevel">
            <ControlLabel>What grade are you in?</ControlLabel>
          {'  '}
            <FormControl
              componentClass="select"
              placeholder="Choose one..."
              defaultValue={props.studentData.gradeLevel.toString()}
              onChange={createChangeHandler("gradeLevel")}
            >
              <option value="4">4th grade</option>
              <option value="5">5th grade</option>
              <option value="6">6th grade</option>
              <option value="7">7th grade</option>
              <option value="8">8th grade</option>
            </FormControl>

          </FormGroup>
          {'  '}
          <FormGroup controlId="iep">
            <ControlLabel>Do you have an IEP?</ControlLabel>
          {'  '}
            <FormControl
              componentClass="select"
              placeholder="Choose one..."
              defaultValue={props.studentData.iep ? "true" : "false"}
              onChange={createChangeHandler("iep")}
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
              onChange={createChangeHandler("ell")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FormControl>
          </FormGroup>
        </Form>

        <AddressTierCalculator
          address={props.studentData.address}
          tier={props.studentData.tier}
          onAddressChange={(newAddress: string) => props.onChange(cloneAndExtend(props.studentData, {address: newAddress}))}
          onTierChange={(newTier: string) => props.onChange(cloneAndExtend(props.studentData, {tier: newTier}))}
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
                onChange={createScoreChangeHandler("nweaMath")}
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
                onChange={createScoreChangeHandler("nweaRead")}
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
                defaultValue={props.studentData.scores.subjGradeMath.toString(10)}
                onChange={createScoreChangeHandler("subjGradeMath")}
              />
            </FormGroup>
          </div>
          <div className="form-wrapper">
            <FormGroup controlId="subjGradeRead"
              validationState={isNotNull(props.studentData.scores.subjGradeRead)} >
              <ControlLabel>Your Reading grade</ControlLabel>
              <FormControl
                type="number"
                defaultValue={props.studentData.scores.subjGradeRead.toString(10)}
                onChange={createScoreChangeHandler("subjGradeRead")}
              />
            </FormGroup>
          </div>
          <div className="form-wrapper">
            <FormGroup controlId="subjGradeSci"
              validationState={isNotNull(props.studentData.scores.subjGradeSci)} >
              <ControlLabel>Your Science grade</ControlLabel>
              <FormControl
                type="number"
                defaultValue={props.studentData.scores.subjGradeSci.toString(10)}
                onChange={createScoreChangeHandler("subjGradeSci")}
              />
            </FormGroup>
          </div> 
          <div className="form-wrapper">
            <FormGroup controlId="subjGradeSocStudies"
              validationState={isNotNull(props.studentData.scores.subjGradeSocStudies)} >
              <ControlLabel>Your Social Studies grade</ControlLabel>
              <FormControl
                type="number"
                defaultValue={props.studentData.scores.subjGradeSocStudies.toString(10)}
                onChange={createScoreChangeHandler("subjGradeSocStudies")}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDataForm;
