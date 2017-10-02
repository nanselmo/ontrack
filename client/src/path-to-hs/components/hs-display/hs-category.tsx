import * as React from "react";

import HSCategoryData from "shared/types/hs-category-data";

import Partition from "shared/components/layout/partition";
import HSAdditionalRequirements from "./hs-additional-requirements";
import HSList from "./hs-list";

interface HSCategoryProps {
  categoryData: HSCategoryData
}

const HSCategory: React.SFC<HSCategoryProps> = (props) => {

  return (
    <Partition>
      <div className="hs-category-title">
        {props.categoryData.longName}
      </div>
      <HSAdditionalRequirements requirements={props.categoryData.additionalRequirements}/>
      <HSList highschools={props.categoryData.highschools}/>
    </Partition>
  )

};

export default HSCategory;
