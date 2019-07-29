import React from 'react';
import * as api from '../../api';
import { Badge, Card, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

class Report extends React.Component {
  state = {
    report: null,
  };

  async componentDidMount() {
    const { id } = this.props;
    const report = await api.fetchReport(id);
    // @todo make minimal checks

    this.setState({ report });
  }

  render() {
    const { report } = this.state;

    if (!report) return <Spinner />;

    const tests = report.tests.length;
    const stats = _.countBy(report.tests, test => {
      const percent = test.stats.passes / test.stats.tests * 100;

      switch (true) {
      case percent === 100:
        return 'passes';
      case percent >= 90 && percent < 100:
        return 'warning';
      default:
        return 'fails';
      }
    });
    const failsPercent = _.get(stats, 'fails', 0) / tests * 100;
    const options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: report.title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Tests',
        colorByPoint: true,
        innerSize: '27%',
        data: [{
          name: 'Passed',
          y: stats.passes || 0,
          color: '#2ec277',
        }, {
          name: 'Failed',
          y: stats.fails || 0,
          color: '#ff7774'
        }, {
          name: 'At risk',
          y: stats.warning || 0,
          color: '#b7e886',
        }]
      }]
    };
    const variant = failsPercent > 10 ? 'danger' : failsPercent <= 10 && failsPercent > 0 ? 'warning' : 'success';

    return (
      <Card border={variant}>
        <Badge variant={variant} className="position-absolute" style={{ top: '1px', right: '1px' }}>
          Failure Rate: {failsPercent}%
        </Badge>
        <Card.Body>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </Card.Body>
      </Card>
    );
  }
}

export default Report;
