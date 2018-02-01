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

interface HSListState {
  selectedProgram: CPSProgram | null
}

import "./hs-list.scss";

class HSList extends React.PureComponent<HSListProps, HSListState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedProgram: null
    };
  }

  private sortBySuccessChance = (programs: CPSProgram[], student: StudentData): CPSProgram[] => {
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

  render() {
    const sortedHighschools: CPSProgram[] = this.sortBySuccessChance(this.props.highschools, this.props.studentData);

    console.log(this.state.selectedProgram);
    return (
      <div 
        className="hs-list"
      >
        { 
          sortedHighschools.map( (hs: CPSProgram) => <HSListElement key={hs.Long_Name} 
                                program={hs} 
                                studentData={this.props.studentData} 
                                selected={ this.state.selectedProgram && hs.ID === this.state.selectedProgram.ID }
                                onSelect={ program => this.setState({selectedProgram: program}) }
                                /> )
        }
      </div>
    )
  }
};

export default HSList;
