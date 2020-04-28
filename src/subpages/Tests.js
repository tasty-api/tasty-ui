import React from 'react';
import { Badge, Button, Col, ListGroup, ProgressBar, Row, Spinner, Toast } from 'react-bootstrap';
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
    funcLog: '',
    loadLog: '',
    error: null,
  };

  socket = socketIOClient();

  async componentDidMount() {
    const filters = {
      type: this.type,
    };
    const tests = await api.fetchTests(filters);
    const status = await api.getStatus();
    const logs = await api.getLog();

    localStorage.setItem('func_log', logs.func);
    localStorage.setItem('load_log', logs.load);

    this.setState({
      tests,
      stats: JSON.parse(localStorage.getItem(this.type === 'func' ? 'func_stats' : 'load_stats')),
      funcLog: logs.func,
      loadLog: logs.load,
      loading: status === 'inProcess'
    });

    this.socket.on('tests:start', () => {
      this.setState({ loading: true });
    });

    this.socket.on('tests:end', (stats) => {
      this.setState({ loading: false, stats, error: null });
      localStorage.setItem(this.type === 'func' ? 'func_stats' : 'load_stats', JSON.stringify(stats));
    });

    this.socket.on('tests:error', (err) => {
      this.setState({ loading: false, error: err });
    });

    this.socket.on('tests:func:log', (log) => {
      localStorage.setItem('func_log', this.state.funcLog + log);
      this.setState({ funcLog: this.state.funcLog + log });
    });

    this.socket.on('tests:load:log', (log) => {
      localStorage.setItem('load_log', this.state.loadLog + log);
      this.setState({ loadLog: this.state.loadLog + log });
    })
  }

  componentWillUnmount() {
    this.socket.removeAllListeners();
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
        [`${this.type}Log`]: localStorage.getItem(this.type === 'func' ? 'func_log' : 'load_log'),
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
      [`${this.type}Log`]: '',
    });

    await api.runTests(filters);
  };

  get type() {
    return _.get(this.props, 'match.params.type', 'func');
  }

  createMarkup = () => {
    return { __html: this.state[`${this.type}Log`] };
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
      <Badge key={code} className="m-1" variant={this.getCodeColor(code)}>{code}: {codes[code]}</Badge>
    ));
  };

  renderScenarios = () => {
    const scenarios = _.get(this.state, 'stats.aggregate.scenarioCounts', {});

    return Object.keys(scenarios).map(scenario => (
      <Badge key={scenario} className="m-1" variant="light">{scenario}: {scenarios[scenario]}</Badge>
    ));
  };

  renderLatency = () => {
    const latencies = _.get(this.state, 'stats.aggregate.latency', {});

    return Object.keys(latencies).map(latency => (
      <Badge key={latency} className="m-1" variant="light">{latency}: {latencies[latency]}</Badge>
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
    const { tests, error } = this.state;

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
        <Toast
          style={{
            position: 'fixed',
            bottom: '12px',
            right: '14px',
            zIndex: 1000,
          }}
          show={!!error}
          onClose={() => this.setState({ error: !error })}
          delay={8000}
          autohide
        >
          <Toast.Header className='bg-danger text-light'>
            <strong className="mr-auto">Tasty Error</strong>
          </Toast.Header>
          <Toast.Body style={{ padding: '20px 15px' }}>{error}</Toast.Body>
        </Toast>
      </>
    );
  }
}

export default Tests;
