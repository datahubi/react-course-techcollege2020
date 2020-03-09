import React, { 
  // useState 
} from "react";
import IO from "./IO";
// import WinAni from "./WinAnimation";


export default function Pong(props) {
  // const [pause, setPause] = useState(false);
  // const [winnerFound, setWinnerFound] = useState(null);
  // // const start = useRef(true);

  // const setWinner = winner => {
  //   setWinnerFound(winner);
  //   setPause(true);
  // };

  return (
    <>
      {/* <button
        onClick={() => {
          setPause(!pause)
          // start.current = !start.current;
        }}
      >
        pause
      </button> */}
      {/* <IO pauseGame={start.current} /> */}
      {/* {winnerFound ? (
        <WinAni winner={winnerFound} />
      ) : (
        <IO winnerFound={setWinner} />
        // <IO pauseGame={pause} winnerFound={setWinner} />
      )} */}

      {/* {!!winnerFound && <WinAni winner={winnerFound} />} */}
      {/* <IO winnerFound={setWinner} /> */}
      <IO />
    </>
  );
}
