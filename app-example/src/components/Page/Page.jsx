import React from 'react';
import Footer from '../Footer/Footer';
import styles from './Page.module.scss';
export const PageStyles = styles;


const Page = props => {
  const {
    pageName,
    children,
    footerComp,
  } = props;

  return (
    <section className={styles.page}>
      <main>
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
