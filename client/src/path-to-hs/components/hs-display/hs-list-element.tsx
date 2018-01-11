import * as React from "react";

import getReqFn from "shared/util/get-req-fn";

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
}

import "./hs-list-element.scss";

class HSListElement extends React.PureComponent<HSListElemProps, HSListElemState> {
  
  constructor(props) {
    super(props);
    const hs = props.program;
    this.state = { 
      showHSPreview: false
    };

    const applicationReqFn = getReqFn(props.program.Application_Requirements_Fn);
    const selectionReqFn = getReqFn(props.program.Program_Selections_Fn);
    const applicationResult = applicationReqFn(props.studentData, props.program); 
    const selectionResult = selectionReqFn(props.studentData, props.program);

    this.className="hs-list-element";
    if (applicationResult.outcome === SuccessChance.NONE) {
      this.className += " disabled";
    } else if (selectionResult.outcome === SuccessChance.CERTAIN ||
                selectionResult.outcome === SuccessChance.LIKELY) {
      this.className += " active-outline";
    }  
  }

  private className: string;

  private toInitials = (hsName:string): string => {
    const isCapitalized = (str: string) => str.toUpperCase() === str;
    // take the intials of all capitalized words
    let initials = "";
    let words = hsName.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const initial = word.charAt(0);
      if (isCapitalized(initial)) {
        initials += initial;
      }
    }
    // keep only the first 3 initials 
    return initials.slice(0, 3);
  }

  render() {
    //if (this.props.highschool.iconUrl) {
    //  return (
    //    <div 
    //      className={this.className} 
    //      onMouseEnter={() => this.setState({showHSPreview: true})}
    //      onMouseLeave={() => this.setState({showHSPreview: false})}
    //      >
    //      <img 
    //        className="hs-list-element-icon"
    //        alt={`${this.props.highschool.shortName} icon`} 
    //        src={this.props.highschool.iconUrl.toString()}
    //      />
    //      <HSInfoCard 
    //        visible={this.state.showHSPreview} 
    //        highschool={this.props.highschool}
    //      />
    //    </div>
    //  );
    //} else {
    return (
      <div 
        className={this.className}
        onMouseEnter={() => this.setState({showHSPreview: true})}
        onMouseLeave={() => this.setState({showHSPreview: false})}
        >
        <span className="hs-list-element-initials">{this.toInitials(this.props.program.Long_Name)}</span>
        <HSProgramInfoCard 
          visible={this.state.showHSPreview} 
          program={this.props.program}
        />
      </div>
    )
  }

};

export default HSListElement;
