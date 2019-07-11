//получает html и рендерит его

import React from 'react';
import {Col} from 'react-bootstrap';
import './styles/styles.scss';


const ConsoleWindow = (props)=>{
  debugger;
  return (
  <Col dangerouslySetInnerHTML={{__html:props.htmlText}}/>
  );
};
export default ConsoleWindow;
