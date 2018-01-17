import * as React from "react";

import getReqFns from "shared/util/get-req-fns";
import HSRequirementFunction from "shared/types/hs-requirement-function";

import CPSProgram from "shared/types/cps-program";
import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

import SuccessChance from "shared/enums/success-chance";
import HSReqFnProgress from "shared/types/hs-req-fn-progress";
type HSReqFnResponse = {outcome: SuccessChance, progress?: HSReqFnProgress};

import HSProgramInfoCard from "./hs-program-info-card";

interface HSListElemProps {
  program: CPSProgram
  studentData: StudentData
}

interface HSListElemState {
  showHSPreview: boolean
  applicationResult: HSReqFnResponse
  selectionResult: HSReqFnResponse
}

import "./hs-list-element.scss";

class HSListElement extends React.PureComponent<HSListElemProps, HSListElemState> {
  
  constructor(props) {
    super(props);
    const hs = props.program;

    const reqFns = getReqFns(props.program);
    this.applicationReqFn = reqFns.application;
    this.selectionReqFn = reqFns.selection;

    const applicationResult = this.applicationReqFn(props.studentData, props.program); 
    const selectionResult = this.selectionReqFn(props.studentData, props.program);

    this.state = { 
      showHSPreview: false,
      applicationResult: applicationResult,
      selectionResult: selectionResult
    };
  }

  private applicationReqFn: HSRequirementFunction;
  private selectionReqFn: HSRequirementFunction;

  componentWillReceiveProps(props) {
    const applicationResult = this.applicationReqFn(props.studentData, props.program); 
    const selectionResult = this.selectionReqFn(props.studentData, props.program);
    this.setState({
      applicationResult: applicationResult,
      selectionResult: selectionResult
    })
  };
  
  private getCombinedSuccessChance = (application: SuccessChance, selection: SuccessChance) => {
    if (application === SuccessChance.CERTAIN || application === SuccessChance.LIKELY) {
      return selection;
    } else {
      return application;
    }
  }

  private outcomeToClassName = (outcome: SuccessChance) => {
    switch(outcome){
      case SuccessChance.CERTAIN:
        return "succ-certain"
      case SuccessChance.LIKELY:
        return "succ-likely"
      case SuccessChance.UNCERTAIN:
        return "succ-uncertain"
      case SuccessChance.UNLIKELY:
        return "succ-unlikely"
      case SuccessChance.NONE:
        return "succ-none"
      case SuccessChance.NOTIMPLEMENTED:
        return "succ-not-implemented"
      default:
        return "succ-not-implemented"
    }
  }

  render() {
    return (
    <div className="hs-list-element">
      <div 
        className={"hs-list-element-icon " + (this.state.showHSPreview ? "focus " : "") + this.outcomeToClassName(this.getCombinedSuccessChance(this.state.applicationResult.outcome, this.state.selectionResult.outcome))}
        onClick={() => this.setState({showHSPreview: !this.state.showHSPreview})}
        >
        <HSProgramInfoCard 
          visible={this.state.showHSPreview} 
          program={this.props.program}
          applicationSuccess={this.state.applicationResult.outcome}
          selectionSuccess={this.state.selectionResult.outcome}
        />
      </div>
      <div className="hs-list-element-shortname">
        {this.props.program.Short_Name}
      </div>
    </div>
    )
  }

};

export default HSListElement;
