import * as React from "react";

interface PartitionProps {
  flex?: {
    flexDirection?: "row" | "column", 
    alignItems?: "center" | "baseline" | "flex-start" | "flex-end" | "stretch",
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-around" | "space-between"
    flexWrap?: "wrap" | "nowrap"
  },
  children?: any,
}

import "./partition.scss";

const Partition = (props: PartitionProps) => {

  return (
    <div className="partition" style={props.flex}>
      {props.children}
    </div>
  )

};

export default Partition;
