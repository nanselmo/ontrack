import * as React from "react";

import StudentScores from "shared/types/student-scores";
import HighschoolDataService from "shared/types/highschool-data-service";

import HSCategory from 
interface HSDisplayProps {
  scores: StudentScores
  hsDataService: HighschoolDataService
};

const HSDisplay: React.SFC<HSDisplayProps> = (props) => {

  return (
    <HSCategory>
    </HSCategory>
  )

};
