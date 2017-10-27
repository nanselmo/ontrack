import * as React from "react"

import StudentData from "shared/types/student-data";
import {StudentDataFormStrings as strings} from "shared/l10n/strings";

import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";

import AddressTierCalculator from "./address-tier-calculator";

import "./student-data-form.scss";

interface StudentDataFormProps {
  studentData: StudentData | null
  onChange: (info: StudentData) => any
}

enum ValidationResponse {
  Success = "success",
  Warn = "warning",
  Err = "error"
}

const StudentDataForm = (props: StudentDataFormProps) => {

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
    <div style={{height: "100%", width: "100%"}} className="student-data-form">
      <FormGroup controlId="studentFirstName"
        validationState={isNotEmpty(props.studentData.studentFirstName)} >
        <FormControl
          type="text"
          value={props.studentData.studentFirstName}
          placeholder="Your first name..."
        />
        <FormControl.Feedback/>
      </FormGroup>

      <FormGroup controlId="studentLastName"
        validationState={isNotEmpty(props.studentData.studentLastName)} >
        <FormControl
          type="text"
          value={props.studentData.studentFirstName}
          placeholder="Your last name..."
        />
        <FormControl.Feedback/>
      </FormGroup>

      <FormGroup controlId="iep">
        <FormControl
          type="radio"
          value={props.studentData.iep ? "true" : "false"}
        />
      </FormGroup>

      <FormGroup controlId="ell">
        <FormControl
          type="radio"
          value={props.studentData.ell ? "true" : "false"}
        />
      </FormGroup>

      {/* may need state to handle this validation properly. */}
      <FormGroup controlId="address"
        validationState={isNotEmpty(props.studentData.address)} >
        <FormControl
          type="text"
          value={props.studentData.address}
          placeholder="123 W Center St."
        />
        <FormControl.Feedback/>
      </FormGroup>

      <div style={{width: "100px"}}>
        <FormGroup controlId="nweaMath"
          validationState={isNotNull(props.studentData.scores.nweaMath)} >
          <FormControl
            type="number"
            value={props.studentData.scores.nweaMath}
          />
          <FormControl.Feedback/>
        </FormGroup>

        <FormGroup controlId="nweaRead"
          validationState={isNotNull(props.studentData.scores.nweaRead)} >
          <FormControl
            type="number"
            value={props.studentData.scores.nweaRead}
          />
          <FormControl.Feedback/>
        </FormGroup>

        <FormGroup controlId="subjGradeMath"
          validationState={isNotNull(props.studentData.scores.subjGradeMath)} >
          <FormControl
            type="number"
            value={props.studentData.scores.subjGradeMath}
          />
          <FormControl.Feedback/>
        </FormGroup>

        <FormGroup controlId="subjGradeRead"
          validationState={isNotNull(props.studentData.scores.subjGradeRead)} >
          <FormControl
            type="number"
            value={props.studentData.scores.subjGradeRead}
          />
          <FormControl.Feedback/>
        </FormGroup>

        <FormGroup controlId="subjGradeSci"
          validationState={isNotNull(props.studentData.scores.subjGradeSci)} >
          <FormControl
            type="number"
            value={props.studentData.scores.subjGradeSci}
          />
          <FormControl.Feedback/>
        </FormGroup>

        <FormGroup controlId="subjGradeSocStudies" 
          validationState={isNotNull(props.studentData.scores.subjGradeSocStudies)} >
          <FormControl
            type="number"
            value={props.studentData.scores.subjGradeSocStudies}
          />
          <FormControl.Feedback/>
        </FormGroup>
      </div>

    </div>

  );
}

export default StudentDataForm;
