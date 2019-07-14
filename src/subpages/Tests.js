import React from 'react';
import { Badge, Button, Col, ListGroup, ProgressBar, Row, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import * as api from '../api';
import { FaPlay as Run } from 'react-icons/fa';
import socketIOClient from 'socket.io-client';
import moment from 'moment';

class Tests extends React.Component {
  state = {
    tests: null,
    selected: [],
    loading: false,
    stats: {},
    log: '',
  };

  async componentDidMount() {
    const filters = {
      type: this.type,
    };
    const tests = await api.fetchTests(filters);

    this.setState({
      tests,
      stats: JSON.parse(localStorage.getItem(this.type === 'func' ? 'func_stats' : 'load_stats')),
      log: localStorage.getItem(this.type === 'func' ? 'func_log' : 'load_log'),
    });

    const socket = socketIOClient('http://localhost:3000');

    socket.on('tests:end', (stats) => {
      this.setState({ loading: false, stats });
      localStorage.setItem(this.type === 'func' ? 'func_stats' : 'load_stats', JSON.stringify(stats));
    });

    socket.on('tests:log', (log) => {
      this.setState({ log: this.state.log + log });
      localStorage.setItem(this.type === 'func' ? 'func_log' : 'load_log', this.state.log + log);
    });
  }

  async componentDidUpdate(prevProps) {
    const { type: prevType } = prevProps.match.params;

    if (this.type !== prevType) {
      const filters = {
        type: this.type,
      };
      const tests = await api.fetchTests(filters);
      this.setState({
        tests,
        selected: [],
        stats: JSON.parse(localStorage.getItem(this.type === 'func' ? 'func_stats' : 'load_stats')),
        log: localStorage.getItem(this.type === 'func' ? 'func_log' : 'load_log'),
      });
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
    const selectedTests = _.get(this.state, 'selected', this.state.tests);
    const filters = {
      type: this.type,
      tests: selectedTests.map(test => test.id),
    };

    this.setState({
      loading: true,
      log: '',
    });

    await api.runTests(filters);
  };

  get type() {
    return _.get(this.props, 'match.params.type', 'func');
  }

  createMarkup = () => {
    return { __html: this.state.log };
  };

  getCodeColor = (code) => {
    switch (true) {
      case code >= 200 && code < 300:
        return 'success';
      case code >= 300 && code < 400:
        return 'primary';
      default:
        return 'danger';
    }
  };

  renderCodes = () => {
    const codes = _.get(this.state, 'stats.aggregate.codes', {});

    return Object.keys(codes).map(code => (
      <Badge className="m-1" variant={this.getCodeColor(code)}>{code}: {codes[code]}</Badge>
    ));
  };

  renderScenarios = () => {
    const scenarios = _.get(this.state, 'stats.aggregate.scenarioCounts', {});

    return Object.keys(scenarios).map(scenario => (
      <Badge className="m-1" variant="light">{scenario}: {scenarios[scenario]}</Badge>
    ));
  };

  renderLatency = () => {
    const latencies = _.get(this.state, 'stats.aggregate.latency', {});

    return Object.keys(latencies).map(latency => (
      <Badge className="m-1" variant="light">{latency}: {latencies[latency]}</Badge>
    ));
  };

  renderStats = () => {
    if (this.type === 'func')
      return (
        <span className="ml-auto">
          <small className="m-1"><b>Started at:</b> {moment(_.get(this.state, 'stats.start')).format('DD.MM.YY hh:mm:ss')}</small>
          <small className="m-1"><b>Finished at:</b> {moment(_.get(this.state, 'stats.end')).format('DD.MM.YY hh:mm:ss')}</small>
          <small className="m-1"><b>Duration:</b> {_.get(this.state, 'stats.duration')}</small>
          <Badge className="m-1" variant="light">Tests: {_.get(this.state, 'stats.tests', 0)}</Badge>
          <Badge className="m-1" variant="success">Passed: {_.get(this.state, 'stats.passes', 0)}</Badge>
          <Badge className="m-1" variant="danger">Failed: {_.get(this.state, 'stats.failures', 0)}</Badge>
        </span>
      );

    return (
      <span className="ml-auto">
        <small className="m-1">Codes:</small>
        {this.renderCodes()}
        <small className="m-1">Scenarios:</small>
        {this.renderScenarios()}
        <small className="m-1">Latency:</small>
        {this.renderLatency()}
      </span>
    );
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
              <Run className="my-auto" size={32} onClick={this.handleRun} style={{ cursor: 'pointer' }} />
            )}
          </div>
          {this.state.loading ? (
            <Col>
              <ProgressBar now={0} className="my-auto" />
            </Col>
          ) : (
            this.renderStats()
          )}
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
            <div dangerouslySetInnerHTML={this.createMarkup()} style={{ whiteSpace: 'pre-wrap' }} />
          </Col>
        </Row>
      </>
    );
  }
}

export default Tests;
