import React, { useState, useContext, createContext } from "react";

const state = {
  darkmode: false,
  toggleDarkmode: x => x
};

export const GlobalState = createContext(state);

export const GlobalStateProvider = props => {
  const [darkmode, setDarkmode] = useState(false);

  const toggleDarkmode = () => {
    setDarkmode(!darkmode);
    console.log("toggleDarkmode -> darkmode", darkmode);
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
  const { toggleDarkmode, darkmode } = useContext(GlobalState);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const updateCoords = e => {
    setCoords({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div onMouseMove={updateCoords} style={{ minHeight: "50vh" }}>
      <button onClick={toggleDarkmode}>
        {darkmode ? "Lightmode" : "Darkmode"}
      </button>{" "}
      <br />
      <p>
        X: {coords.x} Y: {coords.y}
      </p>
    </div>
  );
}
