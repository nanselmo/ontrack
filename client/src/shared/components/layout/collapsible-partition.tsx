import * as React from "react";

import IconComponent from "shared/types/icon";
import IconElement from "shared/types/icon-element";
import IconButton from "shared/components/ui/icon-button";
import ArrowUpIcon from "shared/components/icons/arrow-up";

interface CollapsiblePartitionProps {
  onCollapseChange: (isAlreadyCollapsed: boolean) => any,
  collapsed: boolean,
  flex?: {
    flexDirection?: "row" | "column", 
    alignItems?: "center" | "baseline" | "flex-start" | "flex-end" | "stretch",
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-around" | "space-between"
    flexWrap?: "wrap" | "nowrap"
  },
  children?: any,
}
  
import Partition from "./partition";

import "./collapsible-partition.scss";

const CollapsiblePartition = (props: CollapsiblePartitionProps) => {

  const collapseIcon: IconElement = (
    <ArrowUpIcon  width="20px" height="20px"/>
  );

  let iconStyle = {
    transition: "transform 150ms ease", 
    transform: props.collapsed ? "rotate(180deg)" : ""
  };

  return (
    <div className={`collapsible ${props.collapsed ? "collapsed" : ""}`}>
      <Partition flex={props.flex} children={props.children}/>
      <div style={{
        position: "absolute",
        bottom: -15,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 11
      }}>
      <IconButton 
        icon={collapseIcon} 
        style={iconStyle}
        onClick={
          () => {
            props.onCollapseChange(props.collapsed)
          } }
        />
      </div>
    </div>
  )

};

export default CollapsiblePartition;
