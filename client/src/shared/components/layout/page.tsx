import * as React from "react";

interface PageProps {
  children?: any
}

import "./page.scss";

const Page = (props: PageProps) => {
  return (
    <div className="page">
      {props.children}
    </div>
  )
}

export default Page;

