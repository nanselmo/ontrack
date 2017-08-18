import * as React from "react"

import Dropdown from "shared/components/form/dropdown";
import AddressTierCalculator from "./address-tier-calculator"

import StudentInfo from "shared/types/student-info";
import {StudentInfoStrings as strings} from "shared/l10n/strings";

import "./student-info-form.scss";

interface StudentInfoFormProps {
  studentInfo: StudentInfo | null
  onChange: (info: StudentInfo) => any
}

const StudentInfoForm = (props: StudentInfoFormProps) => {
  if (props.studentInfo !== null) {
    // pre-fill in values
  }
  const handleGradeLevelChange = (value: string) => {
  };
  const handleELLChange = (value: string) => {
  };
  const handleIEPChange = (value: string) => {
  };
  const handleAddressTierChange = (address: string, tier: string) => {
  };

  return (
    <div className="student-info-form">
      <Dropdown size="md" onChange={handleGradeLevelChange} 
        label={strings.gradeLevelDropdown.label}
        placeholder={strings.gradeLevelDropdown.placeholder}
        values={strings.gradeLevelDropdown.values}/>
      <Dropdown size="sm" onChange={handleELLChange}
        label={strings.ellDropdown.label}
        placeholder={strings.ellDropdown.placeholder}
        values={strings.ellDropdown.values} />
      <Dropdown size="sm" onChange={handleIEPChange}
        label={strings.iepDropdown.label}
        placeholder={strings.iepDropdown.placeholder}
        values={strings.iepDropdown.values} />
      <AddressTierCalculator 
        tier={null}
        address={null}
        onChange={handleAddressTierChange}
        addressLabel={strings.addressCalc.addressLabel} 
        tierLabel={strings.addressCalc.tierLabel} />
    </div>
  )
}

export default StudentInfoForm;
