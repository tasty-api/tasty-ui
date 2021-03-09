import React from 'react';
import { Badge, Button, Col, ListGroup,  Row, Spinner, Toast, ProgressBar, Form } from 'react-bootstrap';
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
    errors: [],
    percentage: 0,
    isParallelMode: false,
  };

  socket = socketIOClient();

  async componentDidMount() {
    const filters = {
      type: this.type,
    };
    const tests = await api.fetchTests(filters);
    const status = await api.getStatus();
    const logs = await api.getLog();
    const stats = await api.getStats();

    localStorage.setItem('func_log', logs.func);
    localStorage.setItem('load_log', logs.load);
    localStorage.setItem('func_stats', stats.func);
    localStorage.setItem('load_stats', stats.load);

    this.setState({
      tests,
      stats: JSON.parse(localStorage.getItem(this.type === 'func' ? 'func_stats' : 'load_stats')),
      funcLog: logs.func,
      loadLog: logs.load,
      loading: status === 'inProcess'
    });

    this.socket.on('tests:start', () => {
      localStorage.setItem('func_log', '');
      localStorage.setItem('load_log', '');

      this.setState({
        loading: true,
      });
    });

    this.socket.on('tests:end', (stats) => {
      this.setState({
        loading: false,
        stats,
        percentage: 0
      });
      localStorage.setItem(this.type === 'func' ? 'func_stats' : 'load_stats', JSON.stringify(stats));
    });

    this.socket.on('tests:error', (err) => {
      this.setState((prevState) => ({
        loading: false,
        percentage: 0,
        errors: [...prevState.errors, err]
      }));
    });

    this.socket.on('tests:func:log', (log) => {
      localStorage.setItem('func_log', localStorage.getItem('func_log') + log );
    });

    this.socket.on('tests:func:log', _.throttle(this.setFuncLog, 300, {
      trailing: true,
      leading: false
    }));

    this.socket.on('tests:load:log', (log) => {
      localStorage.setItem('load_log', localStorage.getItem('load_log') + log);
    });

    this.socket.on('tests:load:log', _.throttle(this.setLoadLog, 300, {
      trailing: true,
      leading: false
    }));

    this.socket.on('tests:test:finished', (percentage) => {
      this.setState({
        percentage
      })
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

  setFuncLog = () => {
    this.setState({ funcLog: localStorage.getItem('func_log') })
  };

  setLoadLog = () => {
    this.setState({ loadLog: localStorage.getItem('load_log')  });
  };

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
      tests: selectedTests.length ? selectedTests.map(test => test.id) : this.state.tests.map(test => test.id),
    };

    this.setState({
      loading: true,
      [`${this.type}Log`]: '',
    });

    await api.runTests(filters, this.state.isParallelMode);
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

  handleToastClose = (value) => {
    this.setState((prevState) => {
      const newValue = _.cloneDeep(prevState.errors);
      newValue.splice(newValue.indexOf(value), 1);

      return ({
        errors: newValue
      })
    })
  };

  render() {
    const { tests, errors, percentage, isParallelMode } = this.state;

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
              <ProgressBar now={percentage} label={`${percentage}%`} animated striped className="my-auto" />
            </Col>
          ) : (
            this.renderStats()
          )}
        </Row>
        <Row className="my-3 align-items-center">
          <Col>
            <Button className="my-auto" variant="outline-primary" onClick={this.handleToggleAll}>
              {this.state.selected.length === this.state.tests.length ? 'Unselect All' : 'Select All'}
            </Button>
            <Form.Group className='mb-0' controlId="formBasicCheckbox">
              <Form.Check
                className='mt-2'
                type="checkbox"
                label="Run in Parallel Mode"
                value={isParallelMode}
                onClick={() => this.setState({ isParallelMode: !isParallelMode })}
              />
            </Form.Group>
          </Col>
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
        <div
          style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          position: 'fixed',
          bottom: '12px',
          right: '14px',
          zIndex: 1000,
        }}>
          {
            errors.map((error, index ) => (
              <Toast
                key={error+index}
                onClose={() => this.handleToastClose(error)}
                delay={8000}
                autohide
              >
                <Toast.Header className='bg-danger text-light'>
                  <strong className="mr-auto">Tasty Error</strong>
                </Toast.Header>
                <Toast.Body style={{ padding: '20px 15px' }}>{error}</Toast.Body>
              </Toast>
            ))
          }
        </div>
      </>
    );
  }
}

export default Tests;
