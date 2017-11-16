import * as React from "react";

import Highschool from "shared/types/highschool";
import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

import HSInfoCard from "./hs-info-card";

interface HSListElemProps {
  highschool: Highschool
  studentData: StudentData
  additionalRequirements: AdditionalRequirements
}

interface HSListElemState {
  showHSPreview: boolean
}

import "./hs-list-element.scss";

class HSListElement extends React.PureComponent<HSListElemProps, HSListElemState> {
  
  constructor(props) {
    super(props);
    const hs = props.highschool;

    this.state = { 
      showHSPreview: false
    };

    const canApply: boolean = hs.applicationRequirementsFunction(props.studentData, props.additionalRequirements); 
    const likelySelected: boolean = hs.selectionRequirementsFunction(props.studentData, props.additionalRequirements);

    this.className="hs-list-element";
    if (canApply === false) {
      this.className += " disabled";
    } else if (likelySelected === true) {
      this.className += " active-outline";
    }  
  }

  private className: string;

  render() {
    if (this.props.highschool.iconUrl) {
      return (
        <div 
          className={this.className} 
          onMouseEnter={() => this.setState({showHSPreview: true})}
          onMouseLeave={() => this.setState({showHSPreview: false})}
          >
          <img 
            className="hs-list-element-icon"
            alt={`${this.props.highschool.shortName} icon`} 
            src={this.props.highschool.iconUrl.toString()}
          />
          <HSInfoCard 
            visible={this.state.showHSPreview} 
            highschool={this.props.highschool}
          />
        </div>
      );
    } else {
      return (
        <div 
          className={this.className}
          onMouseEnter={() => this.setState({showHSPreview: true})}
          onMouseLeave={() => this.setState({showHSPreview: false})}
          >
          <span className="hs-list-element-initials">{this.props.highschool.initials}</span>
          <HSInfoCard 
            visible={this.state.showHSPreview} 
            highschool={this.props.highschool}
          />
        </div>
      )
    }
  }

};

export default HSListElement;
