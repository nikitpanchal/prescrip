import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import { multiClientMiddleware } from "redux-axios-middleware";
import {  } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunkMiddleware from "redux-thunk";
import { name as appName } from "../../app.json";
import clients from "./clients";
import rootReducer from "../reducers";

const persistConfig = {
  key: "root",
  blacklist: [],
  whitelist: ["auth", "tab","doctorProfile","certificates","sync","tooltip"],
  keyPrefix: appName,
  storage: AsyncStorage
};
const middlewareConfig = {
  interceptors: {
    request: [{
      success: function ({getState, dispatch, getSourceAction}, req) {
        
        //...
      },
      error: function ({getState, dispatch, getSourceAction}, error) {
        //...
      }
    }
    ],
    response: [{
      success: function ({getState, dispatch, getSourceAction}, req) {
        
        //...
      },
      error: function ({getState, dispatch, getSourceAction}, error) {
        //...
      }
    }
    ]
  }
};
const middlewares = [
  thunkMiddleware,
  multiClientMiddleware(clients),
];
const persistedReducer = persistReducer(persistConfig, rootReducer);
export default () => {
  let store = createStore(persistedReducer, composeWithDevTools(
    applyMiddleware(...middlewares),
  ));
  let persistor = persistStore(store);
  return { store, persistor };
};
