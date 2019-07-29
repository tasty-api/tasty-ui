import React from 'react';
import * as api from '../../api';
import { Spinner } from 'react-bootstrap';
import _ from 'lodash';
import BootstrapTable from 'react-bootstrap-table-next';

class Report extends React.Component {
  state = {
    report: null,
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const report = await api.fetchReport(id);

    this.setState({ report });
  }

  async componentDidUpdate(prevProps) {
    const { id } = this.props.match.params;
    const { id: prevId } = prevProps.match.params;

    if (id !== prevId) {
      const report = await api.fetchReport(id);

      this.setState({ report });
    }
  }

  get id() {
    return _.get(this.props, 'match.params.id', null);
  }

  get type() {
    return _.get(this.props, 'match.params.type', 'func');
  }

  render() {
    const { report } = this.state;

    if (!report) {
      return <Spinner />;
    }
    const columns = [{
      dataField: 'name',
      text: 'Name',
      headerClasses: 'w-50',
      formatter: (cell, row) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${window.location.origin}/report/${this.props.match.params.type}/${this.props.match.params.id}/${row.name}`} // @todo server configuration
        >
          {_.capitalize(row.name)}
        </a>
      )
    }, {
      dataField: 'stats.tests',
      text: 'Tests',
      align: 'right',
      headerAlign: 'right',
      headerClasses: 'w-auto',
    }, {
      dataField: 'stats.passes',
      text: 'Passes',
      align: 'right',
      headerAlign: 'right',
      headerClasses: 'w-auto',
      formatter: (cell, row) => (
        <>
          <div>{(row.stats.passes)}</div>
          <small>{(row.stats.passes / row.stats.tests * 100).toFixed(2)}%</small>
        </>
      ),
    }, {
      dataField: 'stats.pending',
      text: 'Pending',
      align: 'right',
      headerAlign: 'right',
      headerClasses: 'w-auto',
      formatter: (cell, row) => (
        <>
          <div>{(row.stats.pending)}</div>
          <small>{(row.stats.pending / row.stats.tests * 100).toFixed(2)}%</small>
        </>
      ),
    }, {
      dataField: 'stats.failures',
      text: 'Failures',
      align: 'right',
      headerAlign: 'right',
      headerClasses: 'w-auto',
      formatter: (cell, row) => (
        <>
          <div>{(row.stats.failures)}</div>
          <small>{(row.stats.failures / row.stats.tests * 100).toFixed(2)}%</small>
        </>
      ),
    }];

    return (
      <>
        <h1 className="mb-3">{report.title}</h1>
        {this.type === 'func' && (
          <BootstrapTable keyField='name' data={report.tests } columns={ columns } bordered={false} rowClasses={(row) => {
            const percent = row.stats.passes / row.stats.tests * 100;

            switch (true) {
            case percent === 100:
              return 'table-success';
            case percent >= 90 && percent < 100:
              return 'table-warning';
            default:
              return 'table-danger';
            }
          }}/>
        )}
      </>
    );
  }
}

export default Report;
