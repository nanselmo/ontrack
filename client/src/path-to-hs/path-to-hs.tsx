import * as React from "react";

import "./path-to-hs.scss";

const PathToHS = (props: any) => {
  return (
    <div className="box border-success student-info-box">

      <div className="partition partition-lg">
        <div className="partition-header">
          Your MAP Test Results
        </div>
        <div className="partition-body">
            <div className="MAP-test-box">
              <div className="MAP-test-type">
                Math
              </div>
              <div className="MAP-test-score">
                <input className="MAP-test-score-input" type="number" min="150" max="315" defaultValue="200"/>
              </div>
              <div className="MAP-test-score-conversion-symbol">
                = 
              </div>
              <div className="MAP-test-percentile">
                <span className="MAP-test-percentile-value">65</span>
                th percentile
              </div>
            </div>
            <div className="MAP-test-box">
              <div className="MAP-test-type">
                Math
              </div>
              <div className="MAP-test-score">
                <input className="MAP-test-score-input" type="number" min="150" max="315" defaultValue="200"/>
              </div>
              <div className="MAP-test-score-conversion-symbol">
                = 
              </div>
              <div className="MAP-test-percentile">
                <span className="MAP-test-percentile-value">65</span>
                th percentile
              </div>
          </div>
          
        </div>
      </div>


      <div className="partition partition-lg">
        <div className="partition-header">
          Your Grades
        </div>
        <div className="partition-body">
          <div className="sub-partition">
            <div className="sub-partition-header">
              Science 
            </div>
            <div className="sub-partition-body">
              <input className="grade" type="text" value="A"/>
            </div>
          </div>
          <div className="sub-partition">
            <div className="sub-partition-header">
              Social Studies
            </div>
            <div className="sub-partition-body">
              <input className="grade" type="text" value="A"/>
            </div>
          </div>
          <div className="sub-partition">
            <div className="sub-partition-header">
              Math
            </div>
            <div className="sub-partition-body">
              <input className="grade" type="text" value="A"/>
            </div>
          </div>
          <div className="sub-partition">
            <div className="sub-partition-header">
              Reading
            </div>
            <div className="sub-partition-body">
              <input className="grade" type="text" value="A"/>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PathToHS;
