import { combineReducers, createStore, applyMiddleware, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from 'redux-thunk';

import { AppState } from "../models/reduxModels";

import { userReducer } from './userStore'
import { snackbarReducer } from "./snackbarStore";
import { paymentReducer } from "./paymentStore";

const rootReducer = combineReducers({
    paymentState: paymentReducer,
    userState: userReducer,
    snackbarState: snackbarReducer,
});

export default function configureStore(): Store<AppState> {
    const middlewares = [thunkMiddleware];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer)
    );

    return store;
}