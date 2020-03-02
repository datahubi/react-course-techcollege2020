import React, { useState } from "react";
import Confetti from "react-confetti";
import Player from "react-player";
import { useMorph } from "react-morph";

export default function FunNGames(props) {
  const [confettiOn, setConfettiOn] = useState(false);
  const [toggle, setToggle] = useState(false);
  const morph = useMorph();

  return (
    <>
      <h2>Elsker Confetti!!!!</h2>
      <button onClick={() => setConfettiOn(!confettiOn)}>
        {confettiOn ? "FREEEZE!" : "Fyr den af!!!"}
      </button>
      <button onClick={() => setToggle(!toggle)}>Morph</button>
      <Confetti run={confettiOn} />
      {toggle ? (
        <>
          <Player url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" playing />
          <h1 {...morph}>Give you up!</h1>
        </>
      ) : (
        <h2 {...morph}>Never Gonna...</h2>
      )}
    </>
  );
}
