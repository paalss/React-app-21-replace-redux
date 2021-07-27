import { useEffect, useState } from "react";
let globalState = {}; // created once. share data mellom alle som importerer dette
let listeners = [];
let actions = {};

// usestate for å rerendre component. det er poenget. ikke ta vare på verdi
export const useStore = () => {
  const setState = useState(globalState)[1];

  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload); // call function med globalstate og lagre
    globalState = { ...globalState, ...newState };

    for (const listener of listeners) {
      // updates react state with new global state. React will rerender compoent som bruker hook
      listener(globalState);
    }
  };

  useEffect(() => {
    listeners.push(setState);

    return () => {
      // remove listener on unmount
      listeners = listeners.filter((li) => li !== setState);
    };
  }, [setState]);

  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
