import React from "react";
import styles from "./App.module.scss";
import Router from "./components/Router/Router";
import Nav from './components/Nav/Nav';

function App() {
  return (
    <div className={styles.container}>
      <Nav />
      <Router />
    </div>
  );
}

export default App;
