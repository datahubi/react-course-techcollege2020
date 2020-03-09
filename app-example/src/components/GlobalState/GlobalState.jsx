import React, { useState, useContext, createContext } from "react";

const state = {
  darkmode: false,
  toggleDarkmode: x => x,
};

export const GlobalState = createContext(state);

export const GlobalStateProvider = props => {
  const [darkmode, setDarkmode] = useState(false);

  const toggleDarkmode = () => {
    setDarkmode(!darkmode);
    console.log("toggleDarkmode -> darkmode", darkmode)
  };

  const sharedValues = {
    darkmode: darkmode,
    toggleDarkmode: toggleDarkmode  
  };

  return (
    <GlobalState.Provider value={sharedValues}>
      {props.children}
    </GlobalState.Provider>
  );
};

export default function GlobalStateConsumer(props) {
  const {toggleDarkmode, darkmode} = useContext(GlobalState);
  // console.log("GlobalStateConsumer -> darkmode", darkmode)

  return (
    <div>
      <button onClick={toggleDarkmode}>{darkmode ? "Lightmode" : "Darkmode"}</button>
    </div>
  );
}
