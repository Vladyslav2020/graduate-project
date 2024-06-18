import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';

import './index.css';
import {Popup} from "./Popup";
import {initializeStore} from "./redux/Store";

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

initializeStore().then(store => {
    console.log('store', store);
    root.render(<Provider store={store}>
        <Popup/>
    </Provider>);
})

