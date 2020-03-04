import HomePage from "../Pages/Home/Home";
import ContactPage from "../Pages/Contact/Contact";
import AboutPage from "../Pages/About/About";
import FunNGames from "../Pages/FunNGames/FunNGames";
import NewMorph from "../Pages/NewMorph/NewMorph";
import NotFound from "../Pages/NotFound/NotFound";
import Form from "../Pages/FormSteps/FormSteps";
import FetchPage from '../Pages/FetchPage/FetchPage';
import LoaderExample from '../Pages/LoaderExample/LoaderExample';
import Pong from '../Pong/IO';

export const routes = [
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
  },
  {
    name: "FunNGames",
    path: "/funngames",
    exact: true,
    component: FunNGames
  },
  {
    name: "newMorph",
    path: "/newmorph",
    exact: true,
    component: NewMorph
  },
  {
    name: "Form",
    path: "/form",
    exact: false,
    component: Form
  },
  {
    name: "Fetch",
    path: "/fetch",
    exact: false,
    component: FetchPage
  },
  {
    name: "Loader",
    path: "/loader-example",
    exact: false,
    component: LoaderExample
  },
  {
    name: "pong",
    path: "/pong",
    exact: false,
    component: Pong
  },
  {
    name: "fail",
    path: "/fail",
    exact: false,
    component: NotFound
  }
];

export const length = routes.length - 1;