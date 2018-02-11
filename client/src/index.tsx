import * as React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import rootReducer from "shared/reducers";
import { Provider } from "react-redux";

import PathToHS from "./path-to-hs/path-to-hs"

render( (
  <Provider store={createStore(rootReducer)}>
    <PathToHS>
    </PathToHS>
  </Provider>
), document.getElementById("root") );
