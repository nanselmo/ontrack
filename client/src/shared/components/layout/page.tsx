import * as React from "react";

interface PageProps {
  children?: any
}

const Page = (props: PageProps) => {
  return (
    <div style={{width: "100%", height: "100%"}}>
      {props.children}
    </div>
  )
}

export default Page;

