import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import Tests from '../subpages/Tests';


class Testing extends React.Component {
  state = {
    type: 'func',
  };

  render() {
    return (
      <>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link as={NavLink} to={`${this.props.match.url}/func`}>Func</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to={`${this.props.match.url}/load`}>Load</Nav.Link>
          </Nav.Item>
        </Nav>
        <Switch>
          <Route path={`${this.props.match.path}/:type`} component={Tests} />
          <Redirect to={`${this.props.match.path}/func`}/>
        </Switch>
      </>
    );
  }
}

export default Testing;
