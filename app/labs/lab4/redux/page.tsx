"use client";
import { Provider } from "react-redux";
import AddRedux from "./AddRedux";
import CounterRedux from "./CounterRedux";
import HelloRedux from "./hello";
import store from "../store";

export default function ReduxExamples() {
  return (
    <Provider store={store}>
      <div>
        <h2>Redux Examples</h2>
        <HelloRedux />
        <CounterRedux />
        <AddRedux />
      </div>
    </Provider>
  );
}
