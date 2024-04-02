import React from 'react'
import './App.css'
import {Logo} from "../components/Logo";
import {Actions} from "../components/Actions";
import {TestCaseSteps} from "../components/TestCaseSteps";
import {TestSuites} from "../components/TestSuites";

export const App = () => {
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
