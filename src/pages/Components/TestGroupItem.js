import React from 'react';
import {ListGroupItem} from 'react-bootstrap';
import './styles/styles.scss';

const Newcomp = (props)=> (
  <ListGroupItem className="mb-3" active={props.active} onClick={((e)=>props.click({path:props.path,active:!props.active}))}>
    <div>{props.name}</div>
    <small>{props.path}</small>
  </ListGroupItem>
);


export default Newcomp;

