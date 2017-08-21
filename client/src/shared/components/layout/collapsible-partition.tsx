import * as React from "react";

import Icon from "shared/types/icon";
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

const CollapsiblePartition = (props: CollapsiblePartitionProps) => {

  const collapseIcon: Icon = (
    <ArrowUpIcon width="20px" height="20px"/>
  );

  return (
    <div className={`collapsible ${props.collapsed ? "collapsed" : ""}`}>
      <Partition flex={props.flex} children={props.children}/>
      <IconButton icon={collapseIcon} onClick={
          () => {
            props.onCollapseChange(props.collapsed)
          } }/>
    </div>
  )

};

export default CollapsiblePartition;
