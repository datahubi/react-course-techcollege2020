import React, { useContext } from 'react';
import Footer from '../Footer/Footer';
import styles from './Page.module.scss';

import { GlobalState } from '../GlobalState/GlobalState';

export const PageStyles = styles;


const Page = props => {
  const {
    pageName,
    children,
    footerComp,
  } = props;

  const { darkmode } = useContext(GlobalState)
  console.log("darkmode", darkmode)

  const classes = darkmode ? styles.page + " " + styles.darkmode : styles.page

  return (
    // <section className={styles.page}>
    <section className={classes}>
      <main className={styles.container}>
        {pageName && (
          <h2>{pageName}</h2>
        )}
        {children}
      </main>
        {footerComp || <Footer />}
    </section>
  );
};

export const Pageify = (Comp, extraProps = {}) => {
  return function Pageified(props) {
    const { pageProps = {} } = props;
    const newProps = {
      ...props, 
      ...extraProps,
    }
    const _pageProps = {
      ...newProps,
      ...pageProps,
    }
    return (
      <Page {..._pageProps}>
        <Comp {...newProps} />
      </Page>
    );
  };
};

export default Page
