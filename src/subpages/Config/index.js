import React from 'react';
import { Form, Button, Toast } from 'react-bootstrap';
import * as api from '../../api';
import { FaCheck as Success, FaTimes as Failure } from 'react-icons/fa';
import Ajv from 'ajv';
import './styles.modules.scss';
import cn from 'classnames';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.match.params.type,
      configValue: 'loading...',
      showA: false,
      showABody: '',
      showATitle: '',
      schema: null
    };
    this.ajv = new Ajv();
  }

  async componentDidMount() {
    const currentConfig = await api.getConfiguration(this.state.type);
    const schema = await api.getSchema(this.state.type);
    this.setState({
      configValue: JSON.stringify(currentConfig, null, 2),
      schema
    });
  }

  onChange = (event) => {
    this.setState({ configValue: event.target.value });
  };

  async componentWillReceiveProps(nextProps, nextContext) {
    const newValue = await api.getConfiguration(nextProps.match.params.type);
    const schema = await api.getSchema(nextProps.match.params.type);
    this.setState({
      type: nextProps.match.params.type,
      configValue: JSON.stringify(newValue, null, 2),
      schema
    });
  };

  handleSaveButton = async () => {
    //1. validate data
    //const engine = this.ajv.addSchema(this.state.schema,'schema1');
    try {
      debugger;
      const valid = this.ajv.addSchema(this.state.schema, 'schema1').validate('schema1', JSON.parse(this.state.configValue));
      if(valid) {
        const result = await api.setConfiguration(this.state.type, this.state.configValue);
        if (!result.error) {
          this.showToggle(true);
        } else {
          this.showToggle(false, result.err);
        }
      }
      else {
        this.showToggle(false, this.ajv.errorsText());
      }
    } catch(error) {
      this.showToggle(false, `error while operating with JSON structure: ${error}`);
    }
    finally {
      this.ajv.removeSchema('schema1');
    }
  };

  showToggle = (isSuccess, errorText=null) => {
    if(!isSuccess) {
      this.setState({
        showA: !this.state.showA,
        showABody:`error while trying to send current configuration: ${errorText}`,
        showATitle:'ERROR!'
      });
    } else {
      this.setState({
        showA: !this.state.showA,
        showABody:'Your configuration has been successfully saved!',
        showATitle:'SUCCESS!'
      });
    }
  };

  handleClose = () => {
    this.setState({ showA: !this.state.showA });
  };

  render() {
    return (
      <>
        <Toast onClose={() => this.handleClose()} autohide show={this.state.showA} delay={3000} className={cn('toast', this.state.showATitle==='SUCCESS!' ? 'success' : 'danger')}>
          <Toast.Header>
            {this.state.showATitle==='SUCCESS!' ? <Success/> : <Failure/>}
            <strong className="mr-auto"> {this.state.showATitle}</strong>

          </Toast.Header>
          <Toast.Body>{this.state.showABody}</Toast.Body>
        </Toast>
        <Form>
          <Form.Group controlId="exampleForm.ControlTextArea1">
            <Form.Label><h2>Current Configuration for {this.state.type} type of tests</h2>
            </Form.Label>
            <Form.Control as="textarea" rows="10" value={this.state.configValue} onChange={this.onChange}/>
          </Form.Group>
          <Button onClick={this.handleSaveButton}>Save</Button>
        </Form>
      </>);
  }

}

export default Index;
