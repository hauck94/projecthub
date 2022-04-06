import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { authContext, AuthProvider } from './hooks/AuthenticationContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { theme } from './theme';
import { BaseLayout } from './components/BaseLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProjectPage from './pages/ProjectPage/ProjectPage';
import ProfilePage from './pages/ProfilePage';

export const BasePage = () => {
  const { token } = useContext(authContext);
  if (token) {
    return <Redirect to="/dashboard" />;
  }
  return <Redirect to="/login" />;
};

const UnauthenticatedRoute: React.FC<RouteProps> = ({ children, ...routeProps }) => {
  const { token } = useContext(authContext);
  if (token === null) {
    return <Route {...routeProps} />;
  }
  return <Redirect to="/" />;
};

const AuthenticatedRoute: React.FC<RouteProps> = ({ children, ...routeProps }) => {
  const {
    token,
    actions: { getTokenData, logout },
  } = useContext(authContext);
  if (token !== null) {
    const tokenData = getTokenData();
    if (tokenData !== null) {
      const { exp } = tokenData;
      if (parseInt(exp, 10) * 1000 > Date.now()) {
        return <Route {...routeProps} />;
      }
      logout();
    }
  }
  return <Redirect to="/" />;
};

export const internalPages = () => {
  return (
    <BaseLayout>
      <AuthenticatedRoute exact path="/dashboard" component={DashboardPage} />
      <AuthenticatedRoute exact path="/project/:id" component={ProjectPage} />
      <AuthenticatedRoute exact path="/profile/:id" component={ProfilePage} />
    </BaseLayout>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalStyle />
          <Switch>
            <UnauthenticatedRoute exact path="/login" component={LoginPage} />
            <UnauthenticatedRoute exact path="/register" component={RegisterPage} />
            <Route path="/" component={internalPages} />
          </Switch>
          <Route exact path="/" component={BasePage} />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
