import React from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useStoreState, useStoreActions } from 'easy-peasy'

import FormStore from './FormStepsStore';

import styles from "./Form.module.scss";

const Form1 = props => {
  const { order, steps, rootRoute, history } = props;
  const { handleSubmit, register, errors } = useForm();
  const { setData } = useStoreActions(actions => actions.step1)

  const onSubmit = values => {
    setData(values)
    history.push({pathname: rootRoute + steps[order + 1], state: { disableRouteAnimations: true }})
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          ref={register({
            required: "Nødvendig",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "invalid email address"
            }
          })}
        />
        <ErrorMessage errors={errors} name={"email"}>
          {({ message }) => <span>{message}</span>}
        </ErrorMessage>
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          ref={register({
            validate: value => value !== "admin" || "Nice try!"
          })}
        />
        <ErrorMessage errors={errors} name={"username"}>
          {({ message }) => <span>{message}</span>}
        </ErrorMessage>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const Form2 = props => {
  const { steps, order, rootRoute, history } = props;
  const { handleSubmit, register, errors } = useForm();
  const { setData } = useStoreActions(actions => actions.step2)

  const onSubmit = values => {
    setData(values)
    history.push({pathname: rootRoute + steps[order + 1], state: { disableRouteAnimations: true }})
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="age">age</label>
        <input
          name="age"
          type="number"
          ref={register({
            required: true,
            min: {
              value: 18,
              message: "You have to be 18 or above"
            }
          })}
        />
        <ErrorMessage errors={errors} name={"age"}>
          {({ message }) => <span>{message}</span>}
        </ErrorMessage>
      </div>
      <div>
        <label htmlFor="name">hej</label>
        <input
          name="name"
          ref={register({
            pattern: { value: /[a-zA-Z]/gi, message: "Kun bogstaver" },
            required: "Nødvendig"
          })}
        />
        <ErrorMessage errors={errors} name={"name"}>
          {({ message }) => <span>{message}</span>}
        </ErrorMessage>
      </div>
      <Link to={{ pathname: "/form", state: { disableRouteAnimations: true } }}>
        Gå til form
      </Link>
      <br/>
      <button type="submit">Submit</button>
    </form>
  );
};

const Form3 = props => {
  const { rootRoute } = props;
  const { step1: { data: step1Data }, step2: { data: step2Data } } = useStoreState(state => state);
  const { resetStore } = useStoreActions(state => state)
  const summary = {
    ...step1Data,
    ...step2Data
  }

  return (
    <div>
      <button onClick={resetStore}>
        Reset
      </button>
      <pre>
        {JSON.stringify(summary, null, 2)}
      </pre>
      <Link to={{ pathname: rootRoute, state: { disableRouteAnimations: true } }}>
        Gå til form
      </Link>
    </div>
  );
};

const formSteps = [
  {
    name: "Start",
    path: "/step1",
    component: Form1
  },
  {
    name: "Midt",
    path: "/step2",
    component: Form2
  },
  {
    name: "End",
    path: "/step3",
    component: Form3
  }
];

const formStepsRoutes = formSteps.map(step => step.path);


const FormSteps = props => {
  const { location, route: thisRoute } = props;

  const routeWrapper = (Comp, extraProps = {}) => {
    return props => {
      const newProps = {
        ...props,
        ...extraProps
      };
      return <Comp {...newProps} />;
    };
  };


  return (
    <div>
      <FormStore>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            timeout={{ enter: 650, exit: 950 }}
            // mountOnEnter
            // unmountOnExit
            classNames={{
              appear: styles.enter,
              appearActive: styles.enterActive,
              enter: styles.enter,
              enterActive: styles.enterActive,
              exit: styles.exit,
              exitActive: styles.exitActive
            }}
          >
            <Switch location={location}>
              <Route
                path={thisRoute.path}
                exact
                component={routeWrapper(formSteps[0].component, {
                  order: 0,
                  steps: formStepsRoutes,
                  rootRoute: thisRoute.path
                })}
              />
              {formSteps
                .slice(0, formSteps.length)
                .map(({ component, name, path }, idx) => (
                  <Route
                    key={name}
                    path={thisRoute.path + path}
                    component={routeWrapper(component, {
                      order: idx,
                      steps: formStepsRoutes,
                      rootRoute: thisRoute.path,
                    })}
                    exact
                  />
                ))}
              <Route
                path={location.pathname}
                render={() => (
                  <Redirect
                    to={{
                      pathname: thisRoute.path,
                      state: { disableRouteAnimations: true }
                    }}
                  />
                )}
              />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </FormStore>
    </div>
  );
};

export default FormSteps;
