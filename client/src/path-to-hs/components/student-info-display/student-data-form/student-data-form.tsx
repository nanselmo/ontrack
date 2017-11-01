import * as React from "react"

import StudentData from "shared/types/student-data";
import {StudentDataFormStrings as strings} from "shared/l10n/strings";

import {Form, FormGroup, FormControl, ControlLabel} from "react-bootstrap";

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
    <div className="student-data-form">

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

        {/* may need state to handle this validation properly. */}
        <FormGroup controlId="address"
          validationState={isNotEmpty(props.studentData.address)} >
          <ControlLabel>Your address</ControlLabel>
          <FormControl
            type="text"
            defaultValue={props.studentData.address}
            placeholder="123 W Center St."
          />
          <FormControl.Feedback/>
        </FormGroup>
      </div>

      <div className="form-group">
        <div style={{width: "100px"}}>
        <Form horizontal>
            <FormGroup controlId="nweaMath"
              validationState={isNotNull(props.studentData.scores.nweaMath)} >
              <FormControl
                type="number"
                value={props.studentData.scores.nweaMath}
              />
            </FormGroup>

            <FormGroup controlId="nweaRead"
              validationState={isNotNull(props.studentData.scores.nweaRead)} >
              <FormControl
                type="number"
                value={props.studentData.scores.nweaRead}
              />
            </FormGroup>

          <FormGroup controlId="subjGradeMath"
            validationState={isNotNull(props.studentData.scores.subjGradeMath)} >
            <FormControl
              type="number"
              value={props.studentData.scores.subjGradeMath}
            />
          </FormGroup>
        </Form>
        <Form horizontal>
          <FormGroup controlId="subjGradeRead"
            validationState={isNotNull(props.studentData.scores.subjGradeRead)} >
            <FormControl
              type="number"
              value={props.studentData.scores.subjGradeRead}
            />
          </FormGroup>

          <FormGroup controlId="subjGradeSci"
            validationState={isNotNull(props.studentData.scores.subjGradeSci)} >
            <FormControl
              type="number"
              value={props.studentData.scores.subjGradeSci}
            />
          </FormGroup>

          <FormGroup controlId="subjGradeSocStudies"
            validationState={isNotNull(props.studentData.scores.subjGradeSocStudies)} >
            <FormControl
              type="number"
              value={props.studentData.scores.subjGradeSocStudies}
            />
          </FormGroup>
        </Form>
      </div>
    </div>
  </div>

  );
}

export default StudentDataForm;
