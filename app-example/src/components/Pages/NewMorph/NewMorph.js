import React, { useState } from 'react';
import { useMorphKeys } from 'react-morph';

import "./morph.scss";

const ClosedCard = ({ morphs, ...props }) => {
  return (
      <article {...morphs.container} className="closed">
        <figure {...morphs.image} className="closed__image">
          <img src="/imgs/1.jpg" alt="alt" />
        </figure>
        {/* <div {...morphs.inner} className="closed__inner"> */}
        <div className="closed__inner">
          {/* <h2 className="closed__title"> */}
          <h2 {...morphs.title} className="closed__title">
            The very best title
          </h2>
          {/* <h4 className="closed__subtitle"> */}
          <h4 {...morphs.subtitle} className="closed__subtitle">
            Awesome subtitle
          </h4>
        </div>
      </article>
  );
}

const OpenCard = ({ morphs, ...props }) => {
  return (
      <article {...morphs.container} className="open">
        <figure {...morphs.image} className="open__image">
          <img src="/imgs/2.jpg" alt="alt" />
        </figure>
        {/* <div {...morphs.inner} className="open__inner"> */}
        <div className="open__inner">
          <h2 {...morphs.title} className="open__title">
          {/* <h2 className="open__title"> */}
            The very best title
          </h2>
          <h4 {...morphs.subtitle} className="open__subtitle">
          {/* <h4 className="open__subtitle"> */}
            Awesome subtitle
          </h4>
          <p className="open__content">
            Reprehenderit distinctio voluptas deleniti dolorum ut temporibus natus facere inventore. Quia illum fugit laborum reprehenderit quis velit laboriosam magni nemo.
          </p>
        </div>
      </article>
  );
}

const Morph = () => {

  const [isOpen, setIsOpen] = useState(false);

  const morphs = useMorphKeys([
    'container',
    'image',
    // 'inner',
    'title',
    'subtitle'
  ]);

  return (
    <section className="morph-container">
      <h1 onClick={() => setIsOpen(!isOpen)}>Morph</h1>

      {isOpen ? <OpenCard morphs={morphs} /> : <ClosedCard morphs={morphs} />}
    </section>
  );
}

export default Morph;
