import * as React from "react";

import StudentData from "shared/types/student-data";
import HSCategoryData from "shared/types/hs-category-data";
import HSData from "shared/types/hs-data";

import Box from "shared/components/layout/box";
import HSCategory from "./hs-category";

interface HSDisplayProps {
  studentData: StudentData
  hsData: HSData
};

const HSDisplay: React.SFC<HSDisplayProps> = (props) => {

  return (
    <Box width="half" height="full" responsiveBehavior={{mobile: "fullscreen"}}>
      <div style={{width: "100%", height: "100%", overflowY: "auto"}}>
        { props.hsData.map( (category: HSCategoryData) => {
          return <HSCategory categoryData={category}  key={category.shortName}/>
        }) }
      </div>
    </Box>
  )

};

export default HSDisplay;
