import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { withRouter } from "react-router-dom";

import { PageStyles as animationClasses, Pageify } from "../Page/Page";
import NotFound from "../Pages/NotFound/NotFound";
import { routes } from './routes';

export * from './routeHelpers';
export * from './routes';


const Router = props => {
  const {
    location
  } = props;

  const routeClasses = useMemo(() => {
    const disableAnimations =
      !!location.state && !!location.state.disableRouteAnimations;
    if (disableAnimations) return {};
    const goForward = location.state && location.state.goForward;
    const goBack = location.state && location.state.goBack;

    const _animationClasses = {
      appear: animationClasses.enter,
      appearActive: animationClasses.enterActive,
      enter: animationClasses.enter,
      enterActive: animationClasses.enterActive,
      exit: animationClasses.exit,
      exitActive: animationClasses.exitActive
    };
    if (goForward && !goBack) {
      return {
        appear: animationClasses.enterRev,
        appearActive: animationClasses.enterActive,
        enter: animationClasses.enterRev,
        enterActive: animationClasses.enterActive,
        exit: animationClasses.exit,
        exitActive: animationClasses.exitActiveRev
      };
    }
    if (goBack && !goForward) {
      return {
        appear: animationClasses.enter,
        appearActive: animationClasses.enterActive,
        enter: animationClasses.enter,
        enterActive: animationClasses.enterActive,
        exit: animationClasses.exit,
        exitActive: animationClasses.exitActive
      };
    }
    return _animationClasses;
  }, [location]);
  
  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        timeout={{ enter: 650, exit: 950 }}
        mountOnEnter
        unmountOnExit
        classNames={routeClasses}
      >
        <Switch location={location}>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={Pageify(route.component, { route })}
            />
          ))}
          <Route
            key={"not-found"}
            component={Pageify(NotFound, { route: routes[0] })}
          />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Router);
