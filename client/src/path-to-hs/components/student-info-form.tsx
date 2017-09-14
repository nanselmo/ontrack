import * as React from "react"

import CollapsiblePartition from "shared/components/layout/collapsible-partition";
import DropdownField from "shared/components/ui/dropdown-field";
import AddressTierCalculator from "./address-tier-calculator";

import StudentInfo from "shared/types/student-info";
import {StudentInfoStrings as strings} from "shared/l10n/strings";

import "./student-info-form.scss";

interface StudentInfoFormProps {
  studentInfo: StudentInfo | null
  onChange: (info: StudentInfo) => any
}

interface StudentInfoFormState {
  collapsed: boolean
}

class StudentInfoForm extends React.PureComponent<StudentInfoFormProps, StudentInfoFormState> {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.collapsed
    };

    if (props.studentInfo !== null) {
      // pre-fill in values
    }

  }

  private handleGradeLevelChange = (value: string) => {
  };
  private handleELLChange = (value: string) => {
  };
  private handleIEPChange = (value: string) => {
  };
  private handleAddressTierChange = (address: string, tier: string) => {
  };

  private handleCollapse = (isAlreadyCollapsed: boolean) => {

  };
  
  render() {
    return (
      <CollapsiblePartition 
        onCollapseChange={this.handleCollapse} 
        flex={{flexDirection: "row", flexWrap: "nowrap", alignItems: "flex-end"}}
        collapsed={this.state.collapsed}
      >  
        <DropdownField size="md" onChange={this.handleGradeLevelChange} 
          label={strings.gradeLevelDropdown.label}
          placeholder={strings.gradeLevelDropdown.placeholder}
          values={strings.gradeLevelDropdown.values}/>
        <DropdownField size="sm" onChange={this.handleELLChange}
          label={strings.ellDropdown.label}
          placeholder={strings.ellDropdown.placeholder}
          values={strings.ellDropdown.values} />
        <DropdownField size="sm" onChange={this.handleIEPChange}
          label={strings.iepDropdown.label}
          placeholder={strings.iepDropdown.placeholder}
          values={strings.iepDropdown.values} />
        <AddressTierCalculator 
          tier={null}
          address={null}
          onChange={this.handleAddressTierChange}
          addressLabel={strings.addressCalc.addressLabel} 
          tierLabel={strings.addressCalc.tierLabel} />
      </CollapsiblePartition>
    )
  }
}

export default StudentInfoForm;
