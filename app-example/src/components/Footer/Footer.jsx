import React from "react";
import styles from "./Footer.module.scss";

export default function Footer(props) {
  return (
    <footer className={styles.container}>
      Footer {"<indsæt content>"} {props.children}
    </footer>
  );
}
