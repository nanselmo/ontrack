import * as React from "react"

import Form from "shared/components/layout/form";
import SubForm from "shared/components/layout/sub-form";

import GenderField from "./fields/gender-field";
import IEPField from "./fields/iep-field";
import ELLField from "./fields/ell-field";
import LocationField from "./fields/location-field";
import GradeLevelField from "./fields/grade-level-field";
import AttendPercentageField from "./fields/attend-percentage-field";
import CurrESProgramField from "./fields/curr-es-program-field";
import SiblingHSProgramField from "./fields/sibling-hs-program-field";

import NWEAMathField from "./fields/nwea-math-field";
import NWEAReadField from "./fields/nwea-read-field";
import SubjGradeMathField from "./fields/subj-grade-math-field";
import SubjGradeReadField from "./fields/subj-grade-read-field";
import SubjGradeSciField from "./fields/subj-grade-sci-field";
import SubjGradeSocStudiesField from "./fields/subj-grade-soc-studies-field";


const StudentDataForm = (props) => {

  return (
    <Form>
      <SubForm label="Your student information">
        <GenderField/>
        <IEPField/>
        <ELLField/>
        <GradeLevelField/>
        <LocationField/>
        <AttendPercentageField/>
        <CurrESProgramField/>
        <SiblingHSProgramField/>
      </SubForm>
      <SubForm label="Your grades">
        <NWEAMathField/>
        <NWEAReadField/>
        <SubjGradeMathField/>
        <SubjGradeReadField/>
        <SubjGradeSciField/>
        <SubjGradeSocStudiesField/>
      </SubForm>
    </Form>
  );
};

export default StudentDataForm;
