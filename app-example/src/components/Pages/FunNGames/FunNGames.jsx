import React, { useState } from "react";
import Confetti from "react-confetti";
import Player from "react-player";
import { useMorph } from "react-morph";
import styles from './FunNGames.module.scss';

export default function FunNGames(props) {
  const [fun, setFun] = useState(false);
  const morph = useMorph();

  return (
    <>
      {/* <h2>Elsker Confetti!!!!</h2> */}
      <button className={styles.funBtn + " " + fun ? styles.btnOpen : styles.btnClosed} onClick={() => setFun(!fun)}>
        {fun ? "enough fun..." : "START THE FUN"}
      </button>
      <Confetti run={fun} />
      {fun ? (
        <>
          <Player url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" playing />
          <h1 className={styles.h1Morph} {...morph}>Give you up!</h1>
        </>
      ) : (
        <h2 className={styles.h2Morph} {...morph}>Never Gonna...</h2>
      )}
    </>
  );
}
