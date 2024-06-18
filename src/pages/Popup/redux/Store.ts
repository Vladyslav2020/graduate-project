import {applyMiddleware, createStore, Middleware} from 'redux';
import rootReducer, {initialTestSuitesState, RootState} from './Reducers';

const syncWithChromeStorage: Middleware<{}, RootState> = store => next => action => {
    const result = next(action);
    const state = store.getState();

    chrome.storage.local.set({ reduxState: state.root }, () => {
        console.log('State is saved to Chrome local storage.');
    });

    return result;
};

const loadStateFromStorage = (): Promise<RootState> => {
    return new Promise((resolve) => {
        chrome.storage.local.get('reduxState', (result) => {
            if (result.reduxState) {
                resolve({root: result.reduxState});
            } else {
                resolve({root: initialTestSuitesState});
            }
        });
    });
};

export const initializeStore = async () => {
    const preloadedState = await loadStateFromStorage();
    console.log('preloadedState', preloadedState);
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(syncWithChromeStorage)
    );
};