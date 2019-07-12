import React from 'react';
import { Badge, Button, Col, ListGroup, ProgressBar, Row, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import * as api from '../api';
import { FaPlay as Run } from 'react-icons/fa';
import socketIOClient from 'socket.io-client';

class Tests extends React.Component {
  state = {
    tests: null,
    selected: [],
    loading: false,
    stats: {},
  };

  async componentDidMount() {
    const filters = {
      type: _.get(this.props, 'match.params.type', 'func'),
    };
    const tests = await api.fetchTests(filters);

    this.setState({ tests });

    const socket = socketIOClient('http://localhost:3000');

    socket.on('tests:end', (stats) => {
      console.log(stats);
      this.setState({ loading: false, stats });
    });
  }

  async componentDidUpdate(prevProps) {
    const { type } = this.props.match.params;
    const { type: prevType } = prevProps.match.params;

    if (type !== prevType) {
      const filters = {
        type,
      };
      const tests = await api.fetchTests(filters);

      this.setState({ tests, selected: [] });
    }
  }

  handleToggle = (test) => {
    const { selected } = this.state;

    if (_.includes(selected, test)) {
      this.setState({ selected: _.pull(selected, test) });
    } else {
      this.setState({ selected: [ ...this.state.selected, test ] });
    }
  };

  handleToggleAll = () => {
    this.state.selected.length === this.state.tests.length ?
      this.setState({ selected: [] }) :
      this.setState({ selected: [...this.state.tests] });
  };

  handleRun = async () => {
    const filters = {
      type: _.get(this.props, 'match.params.type', 'func'),
      tests: this.state.selected,
    };

    this.setState({
      loading: true,
    });

    await api.runTests(filters);
  };

  render() {
    const { tests } = this.state;

    if (!tests) return <Spinner />;

    return (
      <>
        <Row className="my-3 d-flex align-items-center" noGutters>
          <div style={{ width: '48px', height: '48px' }} className="d-flex align-items-center">
            {this.state.loading ? (
              <Spinner animation="border" />
            ) : (
              <Run className="my-auto" size={32} onClick={this.handleRun} />
            )}
          </div>
          <Col>
            {this.state.loading ? (
              <ProgressBar now={0} className="my-auto" />
            ) : (
              <Row>
                <Col md={2}>
                  Tests: <Badge>{_.get(this.state, 'stats.tests', 0)}</Badge>
                </Col>
                <Col md={2}>
                  Passed: <Badge variant="success">{_.get(this.state, 'stats.passes', 0)}</Badge>
                </Col>
                <Col md={2}>
                  Failed: <Badge variant="danger">{_.get(this.state, 'stats.fails', 0)}</Badge>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Row className="my-3">
          <Button className="ml-3 my-auto" variant="outline-primary" onClick={this.handleToggleAll}>
            {this.state.selected.length === this.state.tests.length ? 'Unselect All' : 'Select All'}
          </Button>
        </Row>
        <Row>
          <Col className="md-3" md={4}>
            <ListGroup>
              {tests.map(test => (
                <ListGroup.Item
                  className="text-truncate"
                  key={test.id}
                  onClick={() => this.handleToggle(test)}
                  active={_.includes(this.state.selected, test)}
                >
                  <div>{test.name}</div>
                  <small>{test.path}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={8}>
          </Col>
        </Row>
      </>
    );
  }
}

export default Tests;
