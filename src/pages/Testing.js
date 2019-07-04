import React from 'react';
import {Tabs, Tab, Container} from 'react-bootstrap';
import './styles/styles.scss';


class Statistics extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: 'functional',
      types: [],
      tests: {}
    }
  }

  getStatistics() {
    fetch('/tests/').then(result => {
      //this.setState({tests: result.json()});
      //debugger;
      result.json().then(res=>{
        //debugger;
        this.setState({tests:res.tests});
      });
    })
  };

  /**
   *  gets all the types of tests from server
   */
  getTypes() {
    fetch('/tests/types/').then(result => {
      //debugger;
      result.json().then(res=>{
        //debugger;
        this.setState({types:res.types});
      });
      //this.setState({types: result.json()});
    })
  }
  componentWillMount(){
    this.getTypes();
    this.getStatistics();
    console.log('state: ',this.state);
  }
  render() {
    const {types} = this.state;
    debugger;
    const typesHtml = types.map(elt=>(<div>Type: {elt}</div>));
    return (
      <Container>
        <h2>Testing</h2>
        {typesHtml}
        <Tabs
          id="example"
          activeKey={this.state.key}
          onSelect={key => this.setState({key})}
        >
          <Tab eventKey="functional" title="functional tests">
            first tab text
          </Tab>
          <Tab eventKey="load" title="load tests">
            second tab text
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default Statistics;
