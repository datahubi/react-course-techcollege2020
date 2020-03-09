import React from "react";
import styles from "./App.module.scss";
import Router from "./components/Router/Router";
import Nav from "./components/Nav/Nav";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <div className={styles.container}>
      <Nav />
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </div>
  );
}

export default App;
