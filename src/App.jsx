import React, { useEffect } from "react";
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom";

import "./App.scss";

const Page = props => {
  const { pageName = "Not Found", children, className: classNameProps } = props;

  useEffect(() => {
    console.log(pageName, "mounted");
    return () => console.log(pageName, "unmounted");
  }, [pageName]);

  const classNameNew = classNameProps ? " " + classNameProps : "";

  return (
    <article className={"page" + classNameNew}>
      <section>
        <h2>{pageName}</h2>
        {children}
      </section>
      <footer className="pageFooter">More info down here..</footer>
    </article>
  );
};

const HomePage = props => (
  <Page pageName="Home" className="home" {...props}>
    <p>Velkommen</p>
  </Page>
);

const AboutPage = props => (
  <Page pageName="About" className={"pageInnerAbout"} {...props}>
    <>
      <p>
        Om os Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
        exercitationem veniam velit aliquid, facere necessitatibus architecto
        iste, nesciunt, culpa placeat hic excepturi nisi corrupti consectetur
        quo cupiditate alias possimus harum quis. Animi eius labore corrupti
        possimus, quisquam cumque ipsum. Cupiditate suscipit esse, sequi tenetur
        quo adipisci id iusto officiis? Aperiam, ipsa ad quisquam perspiciatis
        blanditiis fugiat minima dolores esse ea ullam tenetur id veritatis est,
        nihil delectus optio assumenda commodi cumque exercitationem. Earum,
        recusandae? A hic eaque iure mollitia illum aliquid explicabo natus
        delectus. Fuga ex aspernatur blanditiis quidem dolorum. Facilis,
        delectus ab ipsam atque perspiciatis reprehenderit fugit mollitia
        consectetur est dolores esse, corrupti rem alias qui rerum temporibus at
        vitae modi expedita sit eos! Numquam voluptate unde alias similique
        deleniti non qui quidem minus praesentium eos, perferendis ipsum maiores
        sequi? Consequatur totam aliquam sint eveniet hic expedita deserunt
        vero, neque quia iure nostrum culpa debitis harum temporibus illo.
        Accusamus numquam nam delectus. Obcaecati nemo ab ullam est! Id omnis
        iste, aperiam reprehenderit optio asperiores esse animi distinctio qui
        laboriosam mollitia et ex at tenetur quis libero harum accusamus eum
        dolorem placeat sequi. Mollitia, non in? Iste tempore pariatur sapiente
        voluptas quae expedita ab commodi aspernatur at, rem itaque laboriosam?
      </p>
      <p>
        Om os Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
        exercitationem veniam velit aliquid, facere necessitatibus architecto
        iste, nesciunt, culpa placeat hic excepturi nisi corrupti consectetur
        quo cupiditate alias possimus harum quis. Animi eius labore corrupti
        possimus, quisquam cumque ipsum. Cupiditate suscipit esse, sequi tenetur
        quo adipisci id iusto officiis? Aperiam, ipsa ad quisquam perspiciatis
        blanditiis fugiat minima dolores esse ea ullam tenetur id veritatis est,
        nihil delectus optio assumenda commodi cumque exercitationem. Earum,
        recusandae? A hic eaque iure mollitia illum aliquid explicabo natus
        delectus. Fuga ex aspernatur blanditiis quidem dolorum. Facilis,
        delectus ab ipsam atque perspiciatis reprehenderit fugit mollitia
        consectetur est dolores esse, corrupti rem alias qui rerum temporibus at
        vitae modi expedita sit eos! Numquam voluptate unde alias similique
        deleniti non qui quidem minus praesentium eos, perferendis ipsum maiores
        sequi? Consequatur totam aliquam sint eveniet hic expedita deserunt
        vero, neque quia iure nostrum culpa debitis harum temporibus illo.
        Accusamus numquam nam delectus. Obcaecati nemo ab ullam est! Id omnis
        iste, aperiam reprehenderit optio asperiores esse animi distinctio qui
        laboriosam mollitia et ex at tenetur quis libero harum accusamus eum
        dolorem placeat sequi. Mollitia, non in? Iste tempore pariatur sapiente
        voluptas quae expedita ab commodi aspernatur at, rem itaque laboriosam?
      </p>
      <p>
        Om os Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
        exercitationem veniam velit aliquid, facere necessitatibus architecto
        iste, nesciunt, culpa placeat hic excepturi nisi corrupti consectetur
        quo cupiditate alias possimus harum quis. Animi eius labore corrupti
        possimus, quisquam cumque ipsum. Cupiditate suscipit esse, sequi tenetur
        quo adipisci id iusto officiis? Aperiam, ipsa ad quisquam perspiciatis
        blanditiis fugiat minima dolores esse ea ullam tenetur id veritatis est,
        nihil delectus optio assumenda commodi cumque exercitationem. Earum,
        recusandae? A hic eaque iure mollitia illum aliquid explicabo natus
        delectus. Fuga ex aspernatur blanditiis quidem dolorum. Facilis,
        delectus ab ipsam atque perspiciatis reprehenderit fugit mollitia
        consectetur est dolores esse, corrupti rem alias qui rerum temporibus at
        vitae modi expedita sit eos! Numquam voluptate unde alias similique
        deleniti non qui quidem minus praesentium eos, perferendis ipsum maiores
        sequi? Consequatur totam aliquam sint eveniet hic expedita deserunt
        vero, neque quia iure nostrum culpa debitis harum temporibus illo.
        Accusamus numquam nam delectus. Obcaecati nemo ab ullam est! Id omnis
        iste, aperiam reprehenderit optio asperiores esse animi distinctio qui
        laboriosam mollitia et ex at tenetur quis libero harum accusamus eum
        dolorem placeat sequi. Mollitia, non in? Iste tempore pariatur sapiente
        voluptas quae expedita ab commodi aspernatur at, rem itaque laboriosam?
      </p>
    </>
  </Page>
);

const ContactPage = props => {
  return (
    <Page pageName="Contact" {...props}>
      <h2>Please contact</h2>
    </Page>
  );
};

const routes = [
  {
    name: "Home",
    path: "/",
    exact: true,
    component: HomePage
  },
  {
    name: "Contact",
    path: "/contact",
    exact: true,
    component: ContactPage
  },
  {
    name: "About",
    path: "/about",
    exact: true,
    component: AboutPage
  }
];

function App() {
  return (
    <BrowserRouter>
      <div className={"container"}>
        <nav className={"nav"}>
          <ul className={"navbar"}>
            {routes.map(({ path, exact, name }) => (
              <li key={name}>
                <NavLink
                  className={"navLink"}
                  activeClassName={"navLinkActive"}
                  to={path}
                  exact={exact}
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Switch>
          {routes.map(({ exact, path, component }) => (
            <Route key={path} path={path} exact={exact} component={component} />
          ))}
          <Route component={Page} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
