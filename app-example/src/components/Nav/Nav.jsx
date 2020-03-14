import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import {
  FastForward,
  FastRewind,
  SkipNext,
  SkipPrevious
} from "styled-icons/material";
import styled from "styled-components";

import { routes, getNextPath, getPrevPath } from "../Router/Router";

import styles from "./Nav.module.scss";

const makeDefaultIcon = icon => styled(icon)`
  color: white;
  transition: color 0.3s;
  &:hover {
    color: red;
  }
  &:active {
    color: white;
  }
`;

const Back = makeDefaultIcon(FastRewind);

const Forward = makeDefaultIcon(FastForward);

const NextPath = makeDefaultIcon(SkipNext);

const PrevPath = makeDefaultIcon(SkipPrevious);

function Nav(props) {
  const { location, history } = props;
  const { pathname } = location;

  const { gotoNext, gotoPrev, goForward, goBack } = useMemo(() => {
    return {
      gotoNext: () =>
        history.push(getNextPath(pathname), { 
          goForward: true, 
          goBack: false 
        }),
      gotoPrev: () =>
        history.push(getPrevPath(pathname), {
          goForward: false,
          goBack: true
        }),
      goForward: () => history.goForward(),
      goBack: () => history.goBack()
    };
  }, [pathname, history]);

  // useEffect(() => {
  //   const handler = e => {
  //     const { key } = e;
  //     switch (key) {
  //       case "ArrowLeft": {
  //         return gotoPrev();
  //       }
  //       case "ArrowRight": {
  //         return gotoNext();
  //       }
  //       case "ArrowUp": {
  //         return goBack();
  //       }
  //       case "ArrowDown": {
  //         return goForward();
  //       }
  //       default: {
  //         return;
  //       }
  //     }
  //   };
  //   window.addEventListener("keyup", handler);
  //   return () => window.removeEventListener("keyup", handler);
  // }, [gotoNext, gotoPrev, goForward, goBack]);

  return (
    <nav className={styles.nav}>
      <ul className={styles.navbar}>
        {routes.map(({ path, exact, name }) => (
          <li key={name}>
            {path !== pathname ? (
              <NavLink className={styles.navLink} to={path} exact={exact}>
                {name}
              </NavLink>
            ) : (
              <div className={styles.navLinkActive}>{name}</div>
            )}
          </li>
        ))}
      </ul>
      <ul className={styles.navTools}>
        <li>
          <button onClick={gotoPrev}>
            <PrevPath />
          </button>
        </li>
        <li>
          <button onClick={goBack}>
            <Back />
          </button>
        </li>
        <li>
          <button onClick={goForward}>
            <Forward />
          </button>
        </li>
        <li>
          <button onClick={gotoNext}>
            <NextPath />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default withRouter(Nav);
