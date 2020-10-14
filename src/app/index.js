import React, { lazy, Suspense, useEffect, createContext, useReducer, Fragment } from 'react';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { Transition, TransitionGroup, config as transitionConfig } from 'react-transition-group';
import classNames from 'classnames';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from 'components/Header';
import ThemeProvider from 'components/ThemeProvider';
import { tokens } from 'components/ThemeProvider/theme';
import { msToNum } from 'utils/style';
import { useLocalStorage, usePrefersReducedMotion } from 'hooks';
import { initialState, reducer } from 'app/reducer';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import './index.css';

const Home = lazy(() => import('pages/Home'));
const Contact = lazy(() => import('pages/Contact'));
// const ProjectModern = lazy(() => import('pages/ProjectModern'));
// const ProjectDTT = lazy(() => import('pages/DevTechTools'));
// const ProjectMystGang = lazy(() => import('pages/MystGang'));
const Articles = lazy(() => import('pages/Articles'));
const Page404 = lazy(() => import('pages/404'));

export const AppContext = createContext();
export const TransitionContext = createContext();

const repoPrompt = `\u00A9 2018-${new Date().getFullYear()} Veebor `;

const App = () => {
  const [storedTheme] = useLocalStorage('theme', 'dark');
  const [state, dispatch] = useReducer(reducer, initialState);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      transitionConfig.disabled = true;
    } else {
      transitionConfig.disabled = false;
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!prerender) {
      console.info(`${repoPrompt}\n\n`);
    }

    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    dispatch({ type: 'setTheme', value: storedTheme });
  }, [storedTheme]);

  return (
    <HelmetProvider>
      <ThemeProvider themeId={state.theme}>
        <AppContext.Provider value={{ ...state, dispatch }}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppContext.Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Fragment>
      <Helmet>
        <link rel="canonical" href={`https://codyb.co${pathname}`} />
      </Helmet>
      <a className="skip-to-main" href="#MainContent">
        Skip to main content
      </a>
      <Header location={location} />
      <TransitionGroup component="main" className="app" tabIndex={-1} id="MainContent">
        <Transition
          key={pathname}
          timeout={msToNum(tokens.base.durationS)}
          onEnter={reflow}
        >
          {status => (
            <TransitionContext.Provider value={{ status }}>
              <div className={classNames('app__page', `app__page--${status}`)}>
                <Suspense fallback={<Fragment />}>
                  <Switch location={location}>
                    <Route exact path="/" component={Home} />
                    <Route path="/contact" component={Contact} />
                    {/* <Route path="/projects/modern" component={ProjectModern} />
                    <Route path="/projects/dtt" component={ProjectDTT} />
                    <Route path="/projects/mystgang" component={ProjectMystGang} /> 
                     <Route path="/articles" component={Articles} />*/}
                    <Route component={Page404} />
                  </Switch>
                </Suspense>
              </div>
            </TransitionContext.Provider>
          )}
        </Transition>
      </TransitionGroup>
    </Fragment>
  );
};

export default App;
