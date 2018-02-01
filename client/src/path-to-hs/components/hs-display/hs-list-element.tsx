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
  selected: boolean
  onSelect: (program: CPSProgram) => any
}

interface HSListElemState {
  showHSPreview: boolean
  applicationResult: HSReqFnResponse
  selectionResult: HSReqFnResponse
  pxFromTop: number
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
      showHSPreview: this.props.selected,
      applicationResult: applicationResult,
      selectionResult: selectionResult,
      pxFromTop: 0
    };
  }

  private applicationReqFn: HSRequirementFunction;
  private selectionReqFn: HSRequirementFunction;

  componentWillReceiveProps(nextProps) {
    const applicationResult = this.applicationReqFn(nextProps.studentData, nextProps.program); 
    const selectionResult = this.selectionReqFn(nextProps.studentData, nextProps.program);
    this.setState({
      applicationResult: applicationResult,
      selectionResult: selectionResult,
      showHSPreview: nextProps.selected
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
      <div 
        className="hs-list-element"
        ref={ ref => {
          if (ref) { 
            this.setState({pxFromTop: ref.offsetTop + 50 });
          }
        } }
      >
        <button 
          className={"hs-list-element-icon " + (this.state.showHSPreview ? "focus " : "") + this.outcomeToClassName(this.getCombinedSuccessChance(this.state.applicationResult.outcome, this.state.selectionResult.outcome))}
          onClick={() => {
            this.props.onSelect(this.props.program)
          } }
        />
        <div className="hs-list-element-shortname">
          {this.props.program.Short_Name}
        </div>
        <HSProgramInfoCard 
          visible={this.state.showHSPreview} 
          program={this.props.program}
          applicationSuccess={this.state.applicationResult.outcome}
          selectionSuccess={this.state.selectionResult.outcome}
          style={{top: this.state.pxFromTop}}
        />
      </div>
    )
  }

};

export default HSListElement;
