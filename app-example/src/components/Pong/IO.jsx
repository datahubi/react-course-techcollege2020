import React, { useRef, useEffect, useCallback } from "react";
import {
  // useSprings,
  // interpolate,
  useSpring,
  animated
  // config
} from "react-spring";
import { useGesture } from "react-use-gesture";
import { collisionSound } from "./sound";

const clearRequestInterval = handle => {
  if (!handle) return;
  window.cancelAnimationFrame(handle.value);
};

// Add a function that uses requestAnimationFrame
// and has a similar syntax to setInterval, but more performant
const requestInterval = fn => {
  var handle = {};

  handle.loop = ms => {
    fn.call();
    handle.lastTime = ms;
    handle.value = window.requestAnimationFrame(handle.loop);
  };

  // rAF returns a unique integer per frame, use it to cancelAnimationFrame()
  handle.value = window.requestAnimationFrame(handle.loop);

  return handle;
};

function moveSection(domElemnt, xOffset, yOffset) {
  if (domElemnt) {
    // let transformAttr = ' translate3d(' + xOffset + ', ' + yOffset + '0)' + ' ' + extras;
    // let transformAttr = ` translate(${xOffset},${yOffset})`;
    // domElemnt.setAttribute('transform', transformAttr);
    // let transformAttr = ` translate(${xOffset},${yOffset})`;
    // domElemnt.setAttribute('transform', transformAttr);
    let transformAttr = `translate3d(${xOffset}px,${yOffset}px,0)`;
    domElemnt.style.transform = transformAttr;
  }
}

// Check which direction the ball is heading,
// to prevent that the ball is 'sticking' to the side,
// or the paddles on collisions.
function whichDir(old, current) {
  if (old < current) {
    return -1;
  } else {
    return 1;
  }
}

/**
 *  Get a random number within the range of
 *  min and max. The number is also randomly negative
 * @param {float} min
 * @param {float} max
 */
function getRandomArbitrary(lock = false, min = 0.2, max = 1) {
  // Math.abs(vx) < 0.3
  const number = Math.random() * (max - min) + min;

  if (lock && number < lock) {
    return getRandomArbitrary(lock, min, max);
  }

  if (Math.random() < 0.5) {
    return number;
  } else {
    return -number;
  }
}

function IO(props) {
  const { winnerFound, pauseGame: remotePause } = props;

  const ai = useRef(false);

  const stop = useRef(true);

  const paddleSensitivity = 1.5;
  const ballAcceleration = useRef(6 );
  const ballAccelerationFactor = 1.1;

  const paddleRightRef = useRef();
  const paddleLeftRef = useRef();
  const ballRef = useRef();
  const courtRef = useRef();

  const winningRound = 1;
  const score = useRef({
    player1: 0,
    player2: 0
  });

  const scored = useRef(false);

  const player1Score = useRef();
  const player2Score = useRef();

  const positions = useRef({
    ball: [0, 0],
    paddleLeft: [0, 0],
    paddleRight: [0, 0]
  });

  const winner = useRef(false);

  const getSafeRef = ref => {
    const curRef = ref.current;
    if (curRef) return curRef;
    return null;
  };

  const [{ yConsoleLeft }, setSpringLeft] = useSpring(() => ({
    yConsoleLeft: 0
  }));

  const bindLeft = useGesture({
    // onDrag: ({ movement: [mx, my], memo = yConsoleLeft.getValue(), down }) => {
    onDrag: ({ movement: [mx, my], down, last }) => {
      stop.current = false;
      positions.current.paddleLeft[0] = mx;
      positions.current.paddleLeft[1] = my;
      if (last) {
        positions.current.paddleLeft[0] = 0;
        positions.current.paddleLeft[1] = 0;
      }
      // console.log("positions", positions)
      setSpringLeft({
        yConsoleLeft: down ? my : 0
      });
    }
  });

  // const transformPaddleLeft = yConsoleLeft.interpolate({range: [-10, 0, 10], output: [`translate3d(0,-10px,0)`, `translate3d(0,0px,0)`, `translate3d(0,10px,0)`]});
  const transformConsoleLeft = yConsoleLeft.interpolate(
    y => `translate3d(0,${y * paddleSensitivity}px,0)`
  );
  const transformPaddleLeft = yConsoleLeft.interpolate(
    y => `translate3d(0,${y}px,0)`
  );

  const [{ yConsoleRight }, setSpringRight] = useSpring(() => ({
    yConsoleRight: 0
  }));

  const transformConsoleRight = yConsoleRight.interpolate(
    y => `translate3d(0,${y * paddleSensitivity}px,0)`
  );
  const transformPaddleRight = yConsoleRight.interpolate(
    y => `translate3d(0,${y}px,0)`
  );

  const bindRight = useGesture({
    // onDrag: ({ movement: [mx, my], memo = yConsoleLeft.getValue(), down }) => {
    onDrag: ({ movement: [mx, my], down, last }) => {
      stop.current = false;
      positions.current.paddleRight[0] = mx;
      positions.current.paddleRight[1] = my;
      if (last) {
        positions.current.paddleRight[0] = 0;
        positions.current.paddleRight[1] = 0;
      }
      setSpringRight({
        yConsoleRight: down ? my : 0
      });
    }
  });

  const writeScore = (el, score) => {
    if (el) {
      el.innerHTML = score;
    }
  };

  const playerScored = useCallback(
    player => {
      if (player === "player1") {
        score.current.player1 += 1;
        writeScore(getSafeRef(player1Score), score.current.player1);
      }
      if (player === "player2") {
        score.current.player2 += 1;
        writeScore(getSafeRef(player2Score), score.current.player2);
      }
      if (score.current.player1 === winningRound) {
        winner.current = true;
        winnerFound("Player 1");
      }

      if (score.current.player2 === winningRound) {
        winner.current = true;
        winnerFound("Player 2");
      }
      // resetBallAndPauseGame();
      scored.current = true;
    },
    [winnerFound]
  );

  // useEffect(() => {
  //   // let bgMusic = new Audio('/audio/bg-music.mp3');
  //   // bgMusic.loop = true;
  //   // if(!stop.current) {
  //   //   bgMusic.play()
  //   // } else {
  //   //   bgMusic.pause()
  //   // }
  //   let bgMusic;
  //   bgMusic = new Audio('/audio/bg-music.mp3');
  //   // async function playBgMusic() {

  //   //   bgMusic = new Audio('/audio/bg-music.mp3');
  //   //   bgMusic.loop = true;
  //   //   if(stop.current) {
  //   //     await bgMusic.pause()
  //   //   } else {
  //   //     await bgMusic.play()
  //   //   }
  //   // }
  //   if(stop.current) {
  //     bgMusic.pause()
  //   } else {
  //     bgMusic.play()
  //   }

  //   // playBgMusic()
  //   return async () => {
  //     console.log("bgMusic", bgMusic)
  //     await bgMusic.pause()
  //     bgMusic = null
  //   }
  // }, [stop])

  useEffect(() => {
    const pl = getSafeRef(paddleLeftRef);
    const pr = getSafeRef(paddleRightRef);
    const br = getSafeRef(ballRef);
    const cr = getSafeRef(courtRef);
    let game;

    if (pl && pr && br && cr) {
      let vx = getRandomArbitrary(0.3);
      let vy = getRandomArbitrary();
      const plSize = pl.getBBox();
      const prSize = pr.getBBox();
      const bSize = br.getBBox();
      const cSize = cr.getBBox();
      const courtCenterY = cSize.height / 2;
      const courtCenterX = cSize.width / 2;
      const ballRadiusY = bSize.height / 2;
      const ballRadiusX = bSize.width / 2;
      const paddleRightHeight = prSize.height / 2;
      const paddleLeftHeight = plSize.height / 2;
      const paddleRightWidth = prSize.width;
      const paddleLeftWidth = plSize.width;
      const ballAcc = ballAcceleration.current;

      game = requestInterval(() => {
        // console.log("asdfasfdsadfsafd");
        // if (remotePause && !stop.current) {
        //   stop.current = true;
        // }
        // if (remotePause !== stop.current) {
        //   stop.current = remotePause;
        // }
        if (stop.current || remotePause) return;
        const lastPosX = positions.current.ball[0];
        const lastPosY = positions.current.ball[1];
        const paddleRightPos = positions.current.paddleRight[1];
        const paddleLeftPos = positions.current.paddleLeft[1];

        const newPosX = lastPosX + ballAcc * vx;
        const newPosY = lastPosY + ballAcc * vy;

        const dirY = whichDir(lastPosY, newPosY);
        const dirX = whichDir(lastPosX, newPosX);

        // Check bottom collision
        // if (newPosY >= bane.centerY - bold.ballSize && diry === -1) {
        if (newPosY >= courtCenterY - ballRadiusY && dirY === -1) {
          // console.log("BOTTOM");
          vy = -vy;
          // playBeep()
          collisionSound();
        }

        // Check top collision
        // if (newPosY <= bold.ballSize - bane.centerY && diry === 1) {
        if (newPosY <= ballRadiusY - courtCenterY && dirY === 1) {
          // console.log("TOP");
          vy = -vy;
          // playBeep()
          collisionSound();
        }

        // Check right collision
        if (newPosX >= courtCenterX + 100 && dirX === -1) {
          vx = -vx;
          playerScored("player1");
        }

        // Check left collision
        // if(x <= bold.ballSize - bane.centerX && dirx === 1) {
        if (newPosX <= -courtCenterX - 100 && dirX === 1) {
          vx = -vx;
          playerScored("player2");
        }

        // Check right paddle collision
        if (
          newPosX + ballRadiusX > courtCenterX - paddleRightWidth &&
          newPosX < courtCenterX &&
          newPosY > paddleRightPos - paddleRightHeight &&
          newPosY < paddleRightPos + paddleRightHeight &&
          dirX === -1
        ) {
          // console.log('right' + dt)

          vy = (paddleRightPos * 7) / 900;

          // Reverse that direction
          vx = -vx;

          // Accelerate ball for more stressful fun
          // acc += ballAccelerationFactor;
          ballAcceleration.current += ballAccelerationFactor;
          // playBeep()
          collisionSound();
        }

        // Check left paddle collisions
        if (
          newPosX - ballRadiusX < paddleLeftWidth - courtCenterX &&
          newPosX > -courtCenterX &&
          newPosY > paddleLeftPos - paddleLeftHeight &&
          newPosY < paddleLeftPos + paddleLeftHeight &&
          dirX === 1
        ) {
          // console.log('left' + dt)
          vy = (paddleLeftPos * 7) / 900;

          // Reverse that direction
          vx = -vx;

          // Accelerate ball for more stressful fun
          // acc += ballAccelerationFactor;
          ballAcceleration.current += ballAccelerationFactor;
          // playBeep()
          collisionSound();
        }

        positions.current.ball[0] = newPosX;
        positions.current.ball[1] = newPosY;

        if (scored.current) {
          scored.current = false;
          stop.current = true;
          positions.current.ball[0] = 0;
          positions.current.ball[1] = 0;
          moveSection(br, 0, 0);
          if (ai.current) {
            setSpringLeft({ yConsoleLeft: 0 });
          }
        } else {
          moveSection(br, newPosX, newPosY);
          if (ai.current) {
            setSpringLeft({ yConsoleLeft: newPosY / 2 });
          }
        }
      });
    }
    return () => {
      clearRequestInterval(game);
    };
  }, [
    paddleLeftRef,
    paddleRightRef,
    ballRef,
    courtRef,
    playerScored,
    scored,
    remotePause,
    setSpringLeft
  ]);

  return (
    // <div>
    //   <animated.p {...bind()} style={{transform: xyTranslate}}>
    //     TRÆK HELT VILDT I MIG!
    //   </animated.p>
    // </div>
    <>
      {/* <button
        onClick={() => {
          // stop.current = !stop.current;
          // console.log("stop", stop);
          ai.current = !ai.current;
          // const context = playBeep(500, 100, "square")
          // const context = playNote(500, "sine")
          // console.log("game -> context", context)
        }}
      >
        Start ball
      </button> */}
      <svg
        id="prefix__svg615"
        className="prefix__full-game"
        viewBox="0 0 1981 1102"
        style={{ userSelect: "none" }}
      >
        <style id="style2" type="text/css">
          {
            ".prefix__st24{fill:none;stroke:#f73a00;stroke-width:8;stroke-miterlimit:10}.prefix__st29{display:none}.prefix__st37,.prefix__st38,.prefix__st39,.prefix__st40{fill-rule:evenodd;clip-rule:evenodd;fill:#a97b55}.prefix__st38,.prefix__st39,.prefix__st40{fill:#9d6f50}.prefix__st39,.prefix__st40{fill:#d1ac4e}.prefix__st40{fill:#4a2714}.prefix__st41{fill:#fc9}.prefix__st43{font-size:60px}.prefix__st44,.prefix__st45{fill:#d9a037}.prefix__st45{display:inline}.prefix__st49{font-size:100px}.prefix__st51,.prefix__st52,.prefix__st53{fill-rule:evenodd;clip-rule:evenodd;fill:#c3895c}.prefix__st52,.prefix__st53{fill:#b57d56}.prefix__st53{fill:#a97151}"
          }
        </style>
        <g id="prefix__Layer_1">
          <g id="prefix__g419">
            <linearGradient
              id="prefix__bg_1_"
              x1={990.5}
              x2={990.5}
              y1={412}
              y2={-690}
              gradientTransform="translate(0 690)"
              gradientUnits="userSpaceOnUse"
            >
              <stop id="prefix__stop4" stopColor="#E4D3BB" offset={0.02} />
              <stop id="prefix__stop6" stopColor="#FAF2D9" offset={0.143} />
              <stop id="prefix__stop8" stopColor="#FFF3E3" offset={0.259} />
              <stop id="prefix__stop10" stopColor="#ECEFBD" offset={0.402} />
              <stop id="prefix__stop12" stopColor="#D9A037" offset={0.569} />
              <stop id="prefix__stop14" stopColor="#D7761B" offset={0.712} />
              <stop id="prefix__stop16" stopColor="#751F18" offset={0.851} />
              <stop id="prefix__stop18" stopColor="#350816" offset={1} />
            </linearGradient>
            <g id="prefix__bane">
              <path
                id="prefix__rect237"
                opacity={0.2}
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#fff"
                d="M365.8 295.5h1228v658.6h-1228z"
                ref={courtRef}
              />
              ½
              <path
                id="prefix__bottum_x5F_bande"
                className="prefix__st24"
                d="M1593.8 957.6h-1228"
              />
              <path
                id="prefix__top_x5F_bande"
                className="prefix__st24"
                d="M365.8 291.6h1228"
              />
            </g>
            <animated.path
              id="prefix__paddleLeft"
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#f40ff4"
              d="M365.8 534.9h20v187h-20z"
              style={{ transform: transformPaddleLeft }}
              ref={paddleLeftRef}
            />
            <animated.path
              id="prefix__paddleRight"
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#18ead0"
              d="M1573.8 536.5h20v187h-20z"
              style={{ transform: transformPaddleRight }}
              ref={paddleRightRef}
            />
            <g id="prefix__Cocunut" ref={ballRef}>
              <circle
                id="prefix__circle353"
                cx={979.8}
                cy={624.6}
                r={19.7}
                fill="#7f5c36"
              />
              <path
                id="prefix__path355"
                d="M971.3 608.3c2.7-1.2 5.6-1.8 8.4-1.8 4.6 1.3 8.4 4.1 8.4 4.1.3.1.5.1.7-.1.1-.1.1-.4-.1-.5-.1-.1-2.7-1.9-6.1-3.4 6.2.9 11.9 4.6 14.9 10.4 1.9 3.8 2.2 7.8 1.2 11.4-1.1-.2-3-.2-5.4.9-.1 0-.2.1-.3.1-.2.1-.3.3-.2.5s.3.3.5.2c2.3-1.1 4.2-1.1 5.2-.9-1.5 4.7-5.3 8.8-10.9 11.4-6.1 2.8-12.4 2.8-17.5.4l1.2-1.5c.1-.2.1-.4-.1-.5-.1-.1-.3-.1-.4 0-.1 0-.1.1-.1.1l-1.4 1.6c-.2-.1-.3-.2-.5-.3l1.3-1.6c.1-.2.1-.4-.1-.5-.1-.1-.3-.1-.4 0-.1 0-.1.1-.1.1l-1.3 1.6c-.1-.1-.3-.2-.4-.3l1.3-1.6c.1-.2.1-.4-.1-.5-.1-.1-.3-.1-.4 0-.1 0-.1.1-.1.1l-1.3 1.6c-2.1-1.6-3.8-3.6-5.1-6.1-4.7-9.3-.5-20.5 9.2-24.9z"
                fill="#c69c6d"
              />
            </g>
            <g id="prefix__name_x5F_board_x5F_right">
              <path
                id="prefix__path358"
                className="prefix__st37"
                d="M467.5 120.9h268.4v18.4l-21.5 2.8 16.8 2.6s-40.6 12.7-39.4 12.7c1 0 29.2-2.6 44.1-3.4v25.6l-30.2 4.7 30.2 8.3v51.7H467.5v-86.8l25.7-3.4s-13.4-2.2-25.7-4.1v-29.1z"
              />
              <path
                id="prefix__path360"
                className="prefix__st38"
                d="M707.9 120.9h28v18.4l-21.5 2.8 16.8 2.6s-11.8 3.7-22.5 7.1c0-10.5-.3-21.2-.8-30.9zm.7 35c9-.8 19.8-1.6 27.3-2v25.6L707 184c1-8.4 1.5-18.1 1.6-28.1zm-1.7 28.7l29 7.9v51.7H467.5v-23.9c72.3.2 210.4-.3 227.5-6.5 6.4-2.3 10-13.8 11.9-29.2z"
              />
              <path
                id="prefix__path362"
                className="prefix__st39"
                d="M519.1 100.6c9.4 0 17.2 7.3 17.2 16.2v4.1h-7.7v-2.1c0-5.4-4.3-9.9-9.5-9.9-5.3 0-9.6 4.5-9.6 9.9v2.1h-7.6v-4.1c0-8.9 7.7-16.2 17.2-16.2z"
              />
              <path
                id="prefix__path364"
                className="prefix__st39"
                d="M686.5 100.6c9.5 0 17.2 7.3 17.2 16.2v4.1H696v-2.1c0-5.4-4.3-9.9-9.6-9.9-5.2 0-9.5 4.5-9.5 9.9v2.1h-7.7v-4.1c.1-8.9 7.8-16.2 17.3-16.2z"
              />
              <path
                id="prefix__path366"
                className="prefix__st40"
                d="M522.9-2.9v114.3c0 2-1.8 3.6-3.9 3.6-2.2 0-3.9-1.7-3.9-3.6V-2.9h7.8z"
              />
              <path
                id="prefix__path368"
                className="prefix__st40"
                d="M690.4-2.9v114.3c0 2-1.8 3.6-3.9 3.6s-3.9-1.7-3.9-3.6V-2.9h7.8z"
              />
              <text
                id="prefix__text370"
                className="prefix__st41 prefix__st42 prefix__st43"
                transform="translate(488.958 202.464)"
              >
                {"player 1"}
              </text>
            </g>
            <g id="prefix__name_x5F_board_x5F_left">
              <path
                id="prefix__path373"
                className="prefix__st37"
                d="M1238.5 121.1h268.4v18.4l-21.5 2.8 16.8 2.6s-40.6 12.7-39.4 12.7c1 0 29.2-2.6 44.1-3.4v25.6l-30.2 4.7 30.2 8.3v51.7h-268.4v-86.8l25.7-3.4s-13.4-2.2-25.7-4.1v-29.1z"
              />
              <path
                id="prefix__path375"
                className="prefix__st38"
                d="M1478.9 121.1h28v18.4l-21.5 2.8 16.8 2.6s-11.8 3.7-22.5 7.1c0-10.5-.3-21.1-.8-30.9zm.7 35c9-.8 19.8-1.6 27.3-2v25.6l-28.9 4.5c1-8.4 1.5-18.1 1.6-28.1zm-1.7 28.7l29 7.9v51.7h-268.4v-23.9c72.3.2 210.4-.3 227.5-6.5 6.4-2.3 10-13.8 11.9-29.2z"
              />
              <path
                id="prefix__path377"
                className="prefix__st39"
                d="M1290.1 100.8c9.4 0 17.2 7.3 17.2 16.2v4.1h-7.7V119c0-5.4-4.3-9.9-9.5-9.9-5.3 0-9.6 4.5-9.6 9.9v2.1h-7.6V117c0-8.9 7.7-16.2 17.2-16.2z"
              />
              <path
                id="prefix__path379"
                className="prefix__st39"
                d="M1457.5 100.8c9.5 0 17.2 7.3 17.2 16.2v4.1h-7.7V119c0-5.4-4.3-9.9-9.6-9.9-5.2 0-9.5 4.5-9.5 9.9v2.1h-7.7V117c.1-8.9 7.8-16.2 17.3-16.2z"
              />
              <path
                id="prefix__path381"
                className="prefix__st40"
                d="M1293.9-2.7v114.3c0 2-1.8 3.6-3.9 3.6-2.2 0-3.9-1.7-3.9-3.6V-2.7h7.8z"
              />
              <path
                id="prefix__path383"
                className="prefix__st40"
                d="M1461.4-2.7v114.3c0 2-1.8 3.6-3.9 3.6s-3.9-1.7-3.9-3.6V-2.7h7.8z"
              />
              <text
                id="prefix__text385"
                className="prefix__st41 prefix__st42 prefix__st43"
                transform="translate(1255.66 202.464)"
              >
                {"player 2"}
              </text>
            </g>
            <g id="prefix__Buttons">
              <g id="prefix__play">
                <path
                  id="prefix__path388"
                  className="prefix__st44"
                  d="M1804.4 40.4l-37.3-21.5c-1.3-.8-2.9.2-2.9 1.7v43c0 1.5 1.6 2.4 2.9 1.7l37.3-21.5c1.3-.9 1.3-2.6 0-3.4z"
                />
              </g>
              <g id="prefix__pause" className="prefix__st29">
                <path
                  id="prefix__path391"
                  className="prefix__st45"
                  d="M1777.5 65.6h-11.1c-1.1 0-2.1-1-2.1-2.1V21.2c0-1.2 1-2.1 2.1-2.1h11.1c1.1 0 2.1.9 2.1 2.1v42.3c0 1.1-1 2.1-2.1 2.1z"
                />
                <path
                  id="prefix__path393"
                  className="prefix__st45"
                  d="M1802.8 65.6h-11c-1.2 0-2.1-1-2.1-2.1V21.2c0-1.2.9-2.1 2.1-2.1h11.1c1.2 0 2.1.9 2.1 2.1v42.3c-.1 1.1-1 2.1-2.2 2.1z"
                />
              </g>
              <g id="prefix__Sound">
                <path
                  id="prefix__path396"
                  className="prefix__st44"
                  d="M1861 22.7v38.8c0 3.5-4.2 5.4-6.8 3l-13-11.8h-10.7c-2.2 0-4-1.8-4-4V35.5c0-2.2 1.8-4 4-4h10.7l13-11.8c2.6-2.4 6.8-.5 6.8 3zm18.1.8c10.1 10.8 10.1 26.5 0 37.4-1.8 1.9 1 4.8 2.8 2.8 11.6-12.5 11.6-30.6 0-43.1-1.8-1.9-4.6.9-2.8 2.9zm-6.4 5.2c7.2 7.8 7.2 19 0 26.8-1.8 1.9 1.1 4.8 2.8 2.8 8.7-9.4 8.7-23.1 0-32.5-1.6-1.9-4.5 1-2.8 2.9zm-6.2 5.3c4.4 4.8 4.4 11.5 0 16.2-1.8 1.9 1.1 4.8 2.8 2.8 5.9-6.4 5.9-15.5 0-21.9-1.7-1.9-4.6 1-2.8 2.9z"
                />
              </g>
              <g id="prefix__mute" className="prefix__st29">
                <path
                  id="prefix__path399"
                  className="prefix__st45"
                  d="M1861 22.7v38.8c0 3.5-4.2 5.4-6.8 3l-13-11.8h-10.7c-2.2 0-4-1.8-4-4V35.6c0-2.2 1.8-4 4-4h10.7l13-11.8c2.7-2.4 6.8-.6 6.8 2.9z"
                />
                <path
                  id="prefix__path401"
                  className="prefix__st45"
                  d="M1887.9 49.3l-7.2-7.2 7.2-7.2c1.6-1.6-.9-4-2.5-2.5l-7.2 7.2-7.2-7.2c-1.6-1.6-4 .9-2.5 2.5l7.2 7.2-7.2 7.2c-1.6 1.6.9 4 2.5 2.5l7.2-7.2 7.2 7.2c1.6 1.5 4-1 2.5-2.5z"
                />
              </g>
              <g id="prefix__reset">
                <path
                  id="prefix__path404"
                  className="prefix__st44"
                  d="M1961.2 41.5c-.2-5.9-2.6-11.5-6.8-15.7-9.1-9-24-9-33.1 0s-9.1 23.7 0 32.8c4.4 4.3 10.2 6.7 16.4 6.8 1.8 0 3.3-1.5 3.3-3.3s-1.5-3.3-3.3-3.3c-4.4 0-8.6-1.8-11.7-4.9-6.5-6.5-6.5-17 0-23.5s17.2-6.5 23.7 0c2.4 2.3 3.9 5.3 4.6 8.5l-5.4-2 3.2 19.4 15.4-12.4-6.3-2.4z"
                />
              </g>
              <g id="prefix__ai">
                <path
                  id="prefix__aiBt"
                  className="prefix__st44"
                  d="M1684.4 25.3v33.5c0 3.7 3.2 6.7 7.1 6.7h21.9l14.7 11.1c.3.2.7.3 1.1.3.3 0 .5 0 .7-.1.6-.3 1-.8 1-1.4v-9.9h4.7c4 0 7.1-3 7.1-6.7V25.3c0-3.7-3.2-6.7-7.1-6.7h-44.1c-3.9 0-7.1 3-7.1 6.7zm36.3 7.1h3.9v18.9h-3.9V32.4zm-20.3 19l6.7-18.9h4.5l6.7 18.9h-4.1l-1.3-3.9h-7l-1.2 3.9h-4.3z"
                />
                <path
                  id="prefix__polygon408"
                  className="prefix__st44"
                  d="M1709.4 36.8l-2.4 7.4h4.8z"
                />
              </g>
            </g>
            <g id="prefix__Start_x2F_score">
              <text
                id="prefix__left_x5F_zero"
                className="prefix__st41 prefix__st42 prefix__st49"
                transform="translate(875.658 226.915)"
                ref={player1Score}
              >
                {"0"}
              </text>
              <text
                id="prefix__seperator"
                className="prefix__st41 prefix__st42"
                transform="matrix(1.0818 0 0 1 956.596 211.153)"
                fontSize={79}
              >
                {"-"}
              </text>
              <text
                id="prefix__right_x5F_zero"
                className="prefix__st41 prefix__st42 prefix__st49"
                transform="translate(1027.5 226.915)"
                ref={player2Score}
              >
                {"0"}
              </text>
            </g>
          </g>
          <animated.g
            id="prefix__rightConsole"
            className="prefix__consoles"
            {...bindRight()}
            style={{ transform: transformConsoleRight }}
          >
            <g id="prefix__g427">
              <path
                id="prefix__path421"
                className="prefix__st51"
                d="M1899.9 400.4l9 412.6-22.7.5-11.5-45.9c-.6 5.1-.6 25.3-.4 46.2l-33 .7-11.1-69.3 1.5 69.5-101.6 2.2-9.9-35.5-1.3 35.7-40.9.9-9-412.6 29.2-.6-.7 39.3 13.2-30 7.5 18.8 2.8-28.5 143.4-3.1c5 22.6 12.1 54.3 12.4 58.1.3 4 3.1-32.6 5.3-58.5l17.8-.5z"
              />
              <path
                id="prefix__path423"
                className="prefix__st52"
                d="M1907.7 757l1.2 56-22.7.5-11.5-45.9c-.6 5.1-.6 25.3-.4 46.2l-33 .7-8.1-50.6c25.9-.9 52.8-3.9 74.5-6.9zm-77 6.8l1.1 50.8-101.6 2.2-9.9-35.5-1.3 35.7-40.9.9-9-412.6 29.2-.6-.8 39.3 13.2-30 7.5 18.8 2.6-25.6c0 124.2 4.4 328 31.5 345.6 14.9 9.8 45.5 12 78.4 11z"
              />
              <path
                id="prefix__path425"
                className="prefix__st53"
                d="M1815.7 781.5c.1 5.8-4.4 10.7-10.3 10.8-5.8.1-10.7-4.5-10.8-10.4-.1-5.7 4.5-10.6 10.4-10.7 5.8-.1 10.6 4.6 10.7 10.3zm-7.5-340.5c.1 5.8-4.4 10.6-10.3 10.7-5.8.1-10.7-4.4-10.8-10.3-.1-5.8 4.5-10.7 10.4-10.8s10.6 4.6 10.7 10.4z"
              />
            </g>
            <g id="prefix__downCon_1_">
              <path
                id="prefix__path429"
                className="prefix__st41"
                d="M1795.4 752.2l73.7-95.8c2.6-3.4 3-7.9 1.2-11.7-1.9-3.8-5.7-6.2-10-6.2h-142.5c-4.2 0-8 2.3-9.9 6-.8 1.6-1.2 3.3-1.2 5.1 0 2.3.7 4.6 2.1 6.5l68.8 95.8c2 2.9 5.3 4.6 8.8 4.6 3.5.1 6.9-1.5 9-4.3z"
              />
            </g>
            <g id="prefix__upCon_1_">
              <path
                id="prefix__path432"
                className="prefix__st41"
                d="M1782.7 469.6l-73.9 96c-2.6 3.4-3 7.9-1.2 11.7 1.9 3.8 5.7 6.2 10 6.2h142.9c4.2 0 8-2.3 9.9-6 .8-1.6 1.2-3.3 1.2-5.1 0-2.3-.7-4.6-2.1-6.5l-68.9-96c-2.1-2.9-5.3-4.6-8.9-4.6-3.5-.1-6.9 1.5-9 4.3z"
              />
            </g>
          </animated.g>
          <animated.g
            id="prefix__leftConsole"
            className="prefix__consoles"
            {...bindLeft()}
            style={{ transform: transformConsoleLeft }}
          >
            <g id="prefix__g442">
              <path
                id="prefix__path436"
                className="prefix__st51 prefix__sp"
                d="M302.8 400.4l9 412.6-22.7.5-11.5-45.9c-.6 5.1-.6 25.3-.4 46.2l-33 .7-11.1-69.3 1.5 69.5-101.6 2.2-9.9-35.5-1.3 35.7-40.7 1-9-412.6 29.2-.6-.9 39.3 13.2-30 7.5 18.8 2.8-28.5 143.4-3.1c5 22.6 12.1 54.3 12.4 58.1.3 4 3.1-32.6 5.3-58.5l17.8-.6z"
              />
              <path
                id="prefix__path438"
                className="prefix__st52"
                d="M310.6 757l1.2 56-22.7.5-11.5-45.9c-.6 5.1-.6 25.3-.4 46.2l-33 .7-8.1-50.6c25.9-.9 52.8-3.9 74.5-6.9zm-77.1 6.8l1.1 50.8-101.6 2.2-9.9-35.5-1.3 35.7-40.7 1-9-412.6 29.2-.6-.9 39.3 13.2-30 7.5 18.8 2.6-25.6c0 124.2 4.4 328 31.5 345.6 14.8 9.7 45.5 11.9 78.3 10.9z"
              />
              <path
                id="prefix__path440"
                className="prefix__st53"
                d="M218.6 781.5c.1 5.8-4.4 10.7-10.3 10.8-5.8.1-10.7-4.5-10.8-10.4-.1-5.7 4.5-10.6 10.4-10.7 5.8-.1 10.5 4.6 10.7 10.3zM211.1 441c.1 5.8-4.4 10.6-10.3 10.7-5.8.1-10.7-4.4-10.8-10.3-.1-5.8 4.5-10.7 10.4-10.8 5.8-.1 10.6 4.6 10.7 10.4z"
              />
            </g>
            <g id="prefix__downCon">
              <path
                id="prefix__path444"
                className="prefix__st41"
                d="M198.3 752.2l73.7-95.8c2.6-3.4 3-7.9 1.2-11.7-1.9-3.8-5.7-6.2-10-6.2H120.7c-4.2 0-8 2.3-9.9 6-.8 1.6-1.2 3.3-1.2 5.1 0 2.3.7 4.6 2.1 6.5l68.8 95.8c2 2.9 5.3 4.6 8.8 4.6 3.5.1 6.8-1.5 9-4.3z"
              />
            </g>
            <g id="prefix__upCon">
              <path
                id="prefix__path447"
                className="prefix__st41"
                d="M185.6 469.6l-73.9 96c-2.6 3.4-3 7.9-1.2 11.7 1.9 3.8 5.7 6.2 10 6.2h142.8c4.2 0 8-2.3 9.9-6 .8-1.6 1.2-3.3 1.2-5.1 0-2.3-.7-4.6-2.1-6.5l-68.9-96c-2.1-2.9-5.3-4.6-8.9-4.6-3.4-.1-6.8 1.5-8.9 4.3z"
              />
            </g>
          </animated.g>
        </g>
      </svg>
      {/* <button
        onClick={() => {
          // stop.current = !stop.current;
          // console.log("stop", stop);
          ai.current = !ai.current;
          // const context = playBeep(500, 100, "square")
          // const context = playNote(500, "sine")
          // console.log("game -> context", context)
        }}
      >
        Start ball
      </button> */}
    </>
  );
}

IO.defaultProps = {
  winnerFound: () => {}
};

export default IO;
// export default memo(IO, () => false);
