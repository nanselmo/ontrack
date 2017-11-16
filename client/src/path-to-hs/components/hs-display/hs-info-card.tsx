import * as React from "react";

import Highschool from "shared/types/highschool";

import "./hs-info-card.scss";

interface HSInfoCardProps {
  highschool: Highschool
  visible: boolean
}

const HSInfoCard = (props: HSInfoCardProps) => {

  const hasPreviewUrl = props.highschool.previewUrl !== undefined;

  if (hasPreviewUrl) {
    return (
      <div className={`hs-info-card ${props.visible ? "visible" : "" }`}>
        <iframe 
          className="hs-info-card-preview"
          src={props.highschool.previewUrl.toString()}>
        </iframe>
      </div>
    );
  } else {
    return (
      <div className={`hs-info-card ${props.visible ? "visible" : "" }`}>
        {props.highschool.longName}
      </div>
    )
  }
};

export default HSInfoCard;
