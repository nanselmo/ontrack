import * as React from "react";

import HSCategoryData from "shared/types/hs-category-data";
import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

import Partition from "shared/components/layout/partition";
import HSList from "./hs-list";
import AdditionalRequirementsContainer from "./additional-requirements-container";

import "./hs-category.scss";

interface HSCategoryProps {
  categoryData: HSCategoryData
  studentData: StudentData
}

interface HSCategoryState {
  addlReqs: AdditionalRequirements | null
}

class HSCategory extends React.PureComponent<HSCategoryProps, HSCategoryState> {

  constructor(props) {
    super(props);
    if (Object.keys(props.categoryData.additionalRequirements).length === 0) {
      this.state = {
        addlReqs: null
      }
    } else {
      this.state = {
        addlReqs: props.categoryData.additionalRequirements
      };
    } 
  }

  render() {
    return (
      <div className="hs-category-container">
        <div className="hs-category-title">
          {this.props.categoryData.longName}
        </div>
        { this.state.addlReqs &&
          <AdditionalRequirementsContainer
            additionalRequirements={this.state.addlReqs}
            onRequirementsChange={(newReqs) => this.setState({addlReqs: newReqs})}
          />
        } 
        <HSList 
          highschools={this.props.categoryData.highschools}
          studentData={this.props.studentData}
          addlRequirements={this.state.addlReqs}
          />
      </div>
    )
  }

};

export default HSCategory;
