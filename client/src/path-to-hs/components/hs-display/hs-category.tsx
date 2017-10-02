import * as React from "react";

import HSCategoryData from "shared/types/hs-category-data";
import StudentData from "shared/types/student-data";

import Partition from "shared/components/layout/partition";
import HSAdditionalRequirements from "./hs-additional-requirements";
import HSList from "./hs-list";

import "./hs-category.scss";

interface HSCategoryProps {
  categoryData: HSCategoryData
  studentData: StudentData
}

const HSCategory: React.SFC<HSCategoryProps> = (props) => {

  const additionalReqs = props.categoryData.additionalRequirements;
  const hasAdditionalReqs: boolean = additionalReqs && additionalReqs.length > 0;

  return (
    <div className="hs-category-container">
      <div className="hs-category-title">
        {props.categoryData.longName}
      </div>
      { hasAdditionalReqs &&
        <HSAdditionalRequirements 
          requirements={props.categoryData.additionalRequirements}/> } 
        <HSList 
          highschools={props.categoryData.highschools}
          addlRequirements={props.categoryData.additionalRequirements}
          studentData={props.studentData}
          />
    </div>
  )

};

export default HSCategory;
