import React from "react";
import MyLogo from "./my-logo.svg";

export const Logo = () => {
    return (
        <div style={{flexGrow: 1, fontSize: '30px', display: 'flex', alignItems: 'center', fontWeight: '500'}}>
            <img src={MyLogo} alt="Test automation logo"/>
            <div style={{marginLeft: '5px'}}>Test automation</div>
        </div>
    );
}