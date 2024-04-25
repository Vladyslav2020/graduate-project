import React from 'react'
import {Logo} from "./components/Logo";
import {Actions} from "./components/Actions";
import {TestSuites} from "./components/TestSuites";
import {TestCaseSteps} from "./components/TestCaseSteps";

export const Popup = () => {
  return (
      <div className="app">
        <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px'}}>
          <Logo/>
          <div style={{flexGrow: 2}}>
            <Actions/>
          </div>
        </header>
        <div style={{display: 'flex'}}>
          <TestSuites/>
          <TestCaseSteps/>
        </div>
      </div>
  );
}
