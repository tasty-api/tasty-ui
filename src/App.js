import React from 'react';
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

import Statistics from './pages/Statistics';
import Schedule from './pages/Schedule';
import Testing from './pages/Testing';
import Reports from './pages/Reports';

const PROJECT_NAME = 'Lego';

function App() {
  return (
    <Router>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Navbar.Brand as={NavLink} to="/">{`${PROJECT_NAME} Tasty Point`}</Navbar.Brand>
        <Nav className="mr-auto">
          <NavLink to="/schedule" className="nav-link">Schedule</NavLink>
          <NavLink to="/testing" className="nav-link">Testing</NavLink>
          <NavLink to="/reports" className="nav-link">Reports</NavLink>
        </Nav>
      </Navbar>
      <Container className="App mt-3" fluid>
        <Switch>
          <Route exact path="/" component={Statistics} />
          <Route exact path="/schedule" component={Schedule} />
          <Route exact path="/testing" component={Testing} />
          <Route exact path="/reports" component={Reports} />
          <Redirect to="/" />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
