import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';

import './index.css';
import {Popup} from "./Popup";
import store from "./redux/Store";

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(<Provider store={store}>
    <Popup/>
</Provider>);
