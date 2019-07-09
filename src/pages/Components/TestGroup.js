// lists all the tests and provides customization for tests to run

import React from 'react';
import {ListGroup, Col, Row, Button} from 'react-bootstrap';
import './styles/styles.scss';
import Newcomp from './TestGroupItem';
import ConsoleWindow from './ConsoleWnd';
const requests = require('../../requests');

class TestGroup extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      allTests: props.tests,
      selectedTests:[],
      unselected: props.tests,
      btnSelected: false,
      btnSelectedText:'Select All',
      done:'',
      testResultsHtml:''
    };
    this.selectAll = this.selectAll.bind(this);
  }

  runTests(tests) {
  }

  selectAll(e){
     const newStateTests = [ ...this.state.allTests ];
     for(var i in newStateTests)
     {
       newStateTests[i].active = !this.state.btnSelected;
     }
     const newSelectedBtn = !this.state.btnSelected;
     const text = !newSelectedBtn ? 'Select All' : 'Unselect All';
     const mySelectedTests = newStateTests;
     this.setState({ ...this.state, allTests: newStateTests, btnSelected: newSelectedBtn, btnSelectedText: text, selectedTests:mySelectedTests});
  }

  clickHandler(data)
  {
    // console.log('click',data);

    const newtests = this.state.allTests.map((item)=>{
      if(item.path == data.path)
      {
        item.active = data.active;
      }
      return item;
    });
    const mySelectedTests = newtests.filter(elt=>(elt.active));

    this.setState({...this.state,allTests:newtests,selectedTests:mySelectedTests});
  }
  clickRunHandler(){
    //@todo case when no tests means initiation of all tests in the block!!!
    let selectedTests = this.state.selectedTests.length===0 ? this.props.tests : this.state.selectedTests;
    const self = this;
    requests.runTests({type:this.props.type,tests:selectedTests}).then(result=>{
      self.setState({done:JSON.stringify(result),testResultHtml:result});
    }
  );
  }
  render() {
    const tests = this.state.allTests;
    const {type} = this.props;

    const List = tests.map((elt, index) => (<Newcomp key={index} click={this.clickHandler.bind(this)} active = {elt.active} name={elt.name} path={elt.path}/>));

    if (List.length > 0) {
      return (
        <Row>
          <Col>
            <Button onClick={this.selectAll}>{this.state.btnSelectedText}</Button>
            <ListGroup>
              {List}
            </ListGroup>

            <Button variant="outline-primary" className="list-button" onClick={this.clickRunHandler.bind(this)}> Run -> </Button>
          </Col>
          <ConsoleWindow htmlText={this.state.testResultHtml}/>
        </Row>
      );
    } else {
      return (<h2>No tests found...</h2>)
    }
  }
}

export default TestGroup;
