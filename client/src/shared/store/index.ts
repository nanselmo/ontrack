import {createStore} from "redux";
import rootReducer from "shared/reducers/index";

const store = createStore(rootReducer);

export default store;
