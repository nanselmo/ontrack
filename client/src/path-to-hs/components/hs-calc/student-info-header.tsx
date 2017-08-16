import * as React from "react";

import StudentInfo from "@shared/types/student-info";

import Toggle from "@shared/components/input/toggle";
import {Dropdown, DropdownState} from "@shared/components/input/dropdown";
import AddressTierCalculator from "./address-tier-calculator"

import "./hs-calc.scss";

//import localeStrings from "./hs-calc/locale"
// NOTE: this is a good use case for Redux.
// DEBUG
const strings = {
  gradeLevelDropdown: {
    "label": "Your grade level",
    "placeholder": "",
    "values": {
      "4": "4th grade",
      "5": "5th grade",
      "6": "6th grade",
      "7": "7th grade",
      "8": "8th grade",
    }
  },
  ellDropdown: {
    label: "ELL student?",
    placeholder: "",
    values: {
      "default": "",
      "yes": "yes",
      "no": "no"
    },
    helper: {
      text: "Are you an ELL (English Language Learner) student? Answer yes if you scored below [xxx] on the [xxx].",
      link: "[xxx]"
    }
  },
  iepDropdown: {
    label: "Do you have an IEP?",
    placeholder: "",
    helper: {
      text: "Do you have an Individual Education Plan (IEP), such as [xxx]? IEPs are assigned to students with [xxx][xxx][xxx]. Answer yes if [xxx].",
      link: "[xxx]"
    }
  },
  addressCalc: {
    label: "Your address",
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

  const handleGradeLevelChange = (dropwdownState: DropdownState) => {

  }

  return (
    <div className="partition student-info-header">
      <div className="partition">
        <Dropdown onChange={handleGradeLevelChange} label={strings.gradeLevelDropdown.label}
            values={strings.gradeLevelDropdown.values}/>
        <Toggle id="toggle-ell" />
        <Toggle id="toggle-iep" />
      </div>
      <div className="partition">
        <AddressTierCalculator label={strings.addressCalc.label} address={null} />
      </div>
    </div>
  )
}

export default StudentInfoHeader
