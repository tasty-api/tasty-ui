import React from 'react';
import {InputGroup,ListGroup,ListGroupItem} from 'react-bootstrap';
import './styles/styles.scss';

/*class TestGroupItem extends React.Component
{
  constructor(props)
  {
    super(props);

  }



  render(){
    return(
      <ListGroupItem className="mb-3" active={this.props.active} onClick={((e)=>this.props.click({path:this.props.path,active:!this.props.active}))}>
      <div>{this.props.name}</div>
      <small>{this.props.path}</small>
    </ListGroupItem>
    );
  }
};*/




const Newcomp = (props)=> (
  <ListGroupItem className="mb-3" active={props.active} onClick={((e)=>props.click({path:props.path,active:!props.active}))}>
    <div>{props.name}</div>
    <small>{props.path}</small>
  </ListGroupItem>
);




export default Newcomp;

