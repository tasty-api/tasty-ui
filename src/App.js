import React from 'react';
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

import Testing from './pages/Testing';
import Reports from './pages/Reports';

const PROJECT_NAME = 'Lego';

function App() {
  return (
    <Router>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Navbar.Brand as={NavLink} to="/">{`${PROJECT_NAME} Tasty Point`}</Navbar.Brand>
        <Nav className="mr-auto">
          <NavLink to="/tests" className="nav-link">Tests</NavLink>
          <NavLink to="/reports" className="nav-link">Reports</NavLink>
        </Nav>
      </Navbar>
      <Container className="App my-3" fluid>
        <Switch>
          <Route path="/tests" component={Testing} />
          <Route path="/reports" component={Reports} />
          <Redirect to="/tests" />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
