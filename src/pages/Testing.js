import React from 'react';
import {Tabs, Tab, Container} from 'react-bootstrap';
import './styles/styles.scss';
import TestGroup from './Components/TestGroup2';
const requests = require('../requests');


class Testing extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: 'functional',
      types: [], //"functional", "load"
      tests: {} //[{type:"functional",testFiles:[{name:...,path:...}]}]
    }
  }

  getTests() {
    requests.getTests().then(result=>{
      const tests = result;
      this.setState({tests:tests});
    });
  };

  /**
   *  gets all the types of tests from server
   */
  getTypes() {
    requests.getTypesOfTests().then(result=>{
      const {types} = result;
      this.setState({types});
    });
  }
  componentWillMount(){
    this.getTypes();
    this.getTests();
    console.log('state: ',this.state);
  }
  render() {
    const {types,tests} = this.state;
    const typesHtml = types.map(elt=>(<div>Type: {elt}</div>));
    if(typesHtml.length>0 && Object.keys(this.state.tests).length>0)
    {
      return (
        <Container fluid>
          <h2>Testing</h2>
          <Tabs
            id="example"
            activeKey={this.state.key}
            onSelect={key => this.setState({key})}
          >
            <Tab eventKey="functional" title="functional tests">
              <TestGroup type="functional" tests={this.state.tests['functional']}/>
            </Tab>
            <Tab eventKey="load" title="load tests">
              <TestGroup type="load" tests={this.state.tests['load']}/>
            </Tab>
          </Tabs>
        </Container>
      );
    }
    else
    {
      return(<Container>no tests...</Container>)
    }

  }
}

export default Testing;
