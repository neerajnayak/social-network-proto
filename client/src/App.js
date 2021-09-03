import { Fragment, useEffect } from 'react';
import './App.css';
import NavBar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profiles/Profile';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import PrivateRoute from './components/routing/PrivateRoute';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />
          <Route path="/" exact>
            <Landing />
          </Route>
          <section className="container">
            <Alert />
            <Switch>
              <Route path="/login" exact>
                <Login />
              </Route>
              <Route path="/register" exact>
                <Register />
              </Route>
              <PrivateRoute path="/dashboard" exact component={Dashboard} />
              <PrivateRoute path="/create-profile" exact component={CreateProfile} />
              <PrivateRoute path="/edit-profile" exact component={EditProfile} />
              <PrivateRoute path="/add-experience" exact component={AddExperience} />
              <PrivateRoute path="/add-education" exact component={AddEducation} />
              <Route path="/profiles" exact component={Profiles} />
              <Route path="/profile/:id" component={Profile} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
