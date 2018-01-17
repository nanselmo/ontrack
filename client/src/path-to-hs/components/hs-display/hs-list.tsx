import * as React from "react";

import CPSProgram from "shared/types/cps-program";
import StudentData from "shared/types/student-data";
import SuccessChance from "shared/enums/success-chance";
import getReqFns from "shared/util/get-req-fns";
import getCombinedSuccessChance from "shared/util/get-combined-success-chance";

import HSListElement from "./hs-list-element";

interface HSListProps {
  highschools: CPSProgram[]
  studentData: StudentData
}

import "./hs-list.scss";

const HSList: React.SFC<HSListProps> = (props) => {

  const sortBySuccessChance = (programs: CPSProgram[], student: StudentData): CPSProgram[] => {
    let certain = [];
    let likely = [];
    let uncertain = [];
    let unlikely = [];
    let none = [];
    let notimplemented = [];

    for (let i = 0; i < programs.length; i++) {
      const program = programs[i];
      const successChance = getCombinedSuccessChance(student, program);
      switch (successChance){
        case SuccessChance.CERTAIN:
          certain.push(program);
        break;
        case SuccessChance.LIKELY:
          likely.push(program);
        break;
        case SuccessChance.UNCERTAIN:
          uncertain.push(program);
        break;
        case SuccessChance.UNLIKELY:
          unlikely.push(program);
        break;
        case SuccessChance.NONE:
          none.push(program);
        break;
        case SuccessChance.NOTIMPLEMENTED:
          notimplemented.push(program);
        break;
      }
    }
    
    const sortedPrograms = certain.concat(likely)
                              .concat(uncertain)
                              .concat(unlikely)
                              .concat(none)
                              .concat(notimplemented);

    return sortedPrograms;

  };

  const sortedHighschools: CPSProgram[] = sortBySuccessChance(props.highschools, props.studentData);

  return (
    <div className="hs-list">
      { 
        sortedHighschools.map( (hs: CPSProgram) => <HSListElement key={hs.Long_Name} 
                              program={hs} 
                              studentData={props.studentData} 
                              /> )
      }
    </div>
  )

};

export default HSList;
