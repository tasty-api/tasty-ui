import React from 'react';
import { CardColumns, Col, ListGroup, Row } from 'react-bootstrap';
import { NavLink, Route } from 'react-router-dom';
import * as api from '../../api';
import Report from '../../subpages/Report';
import ReportCard from '../../components/Report';

class Reports extends React.Component {
  state = {
    reports: [],
  };

  async componentDidMount() {
    const { type } = this.props.match.params;
    const filters = {
      type,
    };
    const reports = await api.fetchReports(filters);
    // @todo make minimal checks

    this.setState({ reports });
  }

  async componentDidUpdate(prevProps) {
    const { type } = this.props.match.params;
    const { type: prevType } = prevProps.match.params;

    if (type !== prevType) {
      const filters = {
        type,
      };
      const reports = await api.fetchReports(filters);

      this.setState({ reports });
    }
  }

  render() {
    const { type } = this.props.match.params;
    const { reports } = this.state;

    return (
      <Row className="mt-3">
        <Col md={3}>
          <ListGroup>
            {reports.map(report => (
              <ListGroup.Item
                as={NavLink}
                key={report.id}
                to={`${this.props.match.url}/${report.id}`}
                action
              >
                {report.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9}>
          {type === 'func' && (
            <CardColumns>
              {reports.slice(0, 3).map(report => (
                <ReportCard key={report.id} id={report.id} />
              ))}
            </CardColumns>
          )}
          <Route path={`${this.props.match.path}/:id`} component={Report} />
        </Col>
      </Row>
    );
  }
}

export default Reports;
