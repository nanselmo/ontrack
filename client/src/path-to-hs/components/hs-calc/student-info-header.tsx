import * as React from "react";

import StudentInfo from "shared/types/student-info";

import {Dropdown, DropdownState} from "shared/components/form/dropdown";
import {AddressTierCalculator} from "./address-tier-calculator"

import "./student-info-header.scss";

//import localeStrings from "./hs-calc/locale"
// NOTE: this is a good use case for Redux.
// DEBUG
const strings = {
  gradeLevelDropdown: {
    label: "Your grade level",
    placeholder: " ",
    values: {
      "4": "4th grade",
      "5": "5th grade",
      "6": "6th grade",
      "7": "7th grade",
      "8": "8th grade",
    }
  },
  ellDropdown: {
    label: "ELL student?",
    placeholder: " ",
    values: {
      "yes": "yes",
      "no": "no"
    },
    helper: {
      text: "Are you an ELL (English Language Learner) student? Answer yes if you scored below [xxx] on the [xxx].",
      link: "[xxx]"
    }
  },
  iepDropdown: {
    label: "IEP?",
    placeholder: " ",
    values: {
      "yes": "yes",
      "no": "no"
    },
    helper: {
      text: "Do you have an Individual Education Plan (IEP), such as [xxx]? IEPs are assigned to students with [xxx][xxx][xxx]. Answer yes if [xxx].",
      link: "[xxx]"
    }
  },
  addressCalc: {
    addressLabel: "Your address",
    tierLabel: "Your tier",
    error: "Address not found!"
  }
}

interface StudentInfoHeaderProps {
  studentInfo: StudentInfo | null
  onChange: (info: StudentInfo) => any
}

const StudentInfoHeader = (props: StudentInfoHeaderProps) => {
  if (props.studentInfo !== null) {
    // pre-fill in values
  }
  const handleGradeLevelChange = (dropdownState: DropdownState) => {
  }
  const handleELLChange = (dropdownState: DropdownState) => {
  }
  const handleIEPChange = (dropdownState: DropdownState) => {
  }

  return (
    <div className="student-info-header">
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
        addressLabel={strings.addressCalc.addressLabel} 
        tierLabel={strings.addressCalc.tierLabel} />
    </div>
  )
}

export default StudentInfoHeader;
