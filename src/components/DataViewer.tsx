import * as React from 'react';
import { Tag, DataPoint } from './types/api_types';
import { Line } from 'react-chartjs-2';
import './DataViewer.css';
/*import { decimate } from '../data_utils/data_utils';*/

interface DataViewerProps {
  tag: Tag;
}

interface DataViewerState {
  tagData: Array<DataPoint>;
  time: Array<any>;
  data: Array<any>;
  startTime: Date;
  endTime: Date;
  loading: boolean;
}

interface DataViewer {
  tag: Tag;
}

class DataViewer extends React.Component<DataViewerProps, DataViewerState> {
  constructor(props: DataViewerProps) {
    super(props);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.getData = this.getData.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.tag = null;
    this.state = {
      tagData: [],
      time: [],
      data: [],
      endTime: new Date(2017, 10, 30),
      startTime: new Date(2017, 10, 28),
      loading: true
    };
  }

  updateTagData(tag: Tag) {
    const startTS = this.getApiDateString(this.state.startTime);
    const endTS = this.getApiDateString(this.state.endTime);
    this.setState({loading: true}, () => {
      fetch(`http://cs-mock-timeseries-api.azurewebsites.net/api/DataPoint/${tag.tagId}?startTS=${startTS}&endTS=${endTS}`)
      .then(response => {
        response.json()
        .then(data => {
          const [values, timestamps] = data.reduce(([vs, ts]: Array<Array<any>>, datapoint: DataPoint) => {
                                                      vs.push(datapoint.value);
                                                      ts.push(datapoint.observationTS);
                                                      return [vs, ts];
                                                   },
                                                   [[], []]);
          /*data = decimate(data, 60);*/
          this.setState({tagData: data, time: timestamps, data: values, loading: false});
        });
      });
    });
  }

  getApiDateString(date: Date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  getDateInputString(date: Date) {
    const formattedDate = ('0' + date.getDate()).slice(-2);
    const formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    const formattedYear = date.getFullYear();
    return `${formattedYear}-${formattedMonth}-${formattedDate}`;
  }

  updateStartDate(e: React.ChangeEvent<HTMLInputElement>) {
    const dateString = e.target.value.split('-');
    const dateArray = dateString.map(date => {
      return parseInt(date, 10);
    });
    const newDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    this.setState({startTime: newDate}, () => {
      this.updateTagData(this.tag);
    });
  }

  updateEndDate(e: React.ChangeEvent<HTMLInputElement>) {
    const dateString = e.target.value.split('-');
    const dateArray = dateString.map(date => {
      return parseInt(date, 10);
    });
    const newDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    this.setState({endTime: newDate}, () => {
      this.updateTagData(this.tag);
    });
  }

  componentWillMount() {
    this.tag = this.props.tag;
    this.updateTagData(this.props.tag);
  }

  componentWillReceiveProps(nextProps: DataViewerProps) {
    this.tag = nextProps.tag;
    this.updateTagData(nextProps.tag);
  }

  getData() {
    let dataReversed = Array.from(this.state.data);
    dataReversed = dataReversed.reverse();
    let timeReversed = Array.from(this.state.time);
    timeReversed = timeReversed.reverse();

    const dataSet = {
      labels: timeReversed,
      datasets: [
        {
          label: this.props.tag.label,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataReversed
        }
      ]
    };

    return dataSet;
  }

  getOptions() {
    return(
      {
        title: {
          display: true,
          text: this.props.tag.label
        },
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: this.props.tag.unit
                },
                ticks: {
                }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Time'
              }
            }]
        }
      }
    );
  }

  renderRows() {
    return this.state.tagData.map((datapoint: DataPoint, index) => {
      return (
        <tr key={index}>
          <td>{datapoint.observationTS.toString()}</td>
          <td>{datapoint.value.toString()}</td>
        </tr>
      );
    });
  }

  renderTable() {
    return (
      <div className="table-wrapper">
        <h2>{this.tag.label}</h2>
        <table>
          <thead>
            <tr>
              <td>Time</td>
              <td>{this.tag.unit}</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { startTime, endTime, loading } = this.state;
    const startDate = this.getDateInputString(startTime);
    const endDate = this.getDateInputString(endTime);
    let graph = true;
    if (this.tag.dataType === 'boolean' || this.tag.dataType === 'string') {
      graph = false;
    }

    return(
      <div className="data-viewer">
        <div className="date-picker">
          <div className="end-date">
            <p>End Date</p>
            <input
              type="date"
              defaultValue={endDate}
              max="2017-11-30"
              min="2017-10-15"
              onChange={this.updateEndDate}
            />
          </div>
          <div className="start-date">
            <p>Start Date</p>
            <input
              type="date"
              defaultValue={startDate}
              max="2017-11-30"
              min="2017-10-15"
              onChange={this.updateStartDate}
            />
          </div>
        </div>
        <div className="data-display">
          {graph && !loading && <Line data={this.getData} options={this.getOptions()} width={400} height={400} />}
          {loading && <div>Loading...</div>}
          {!graph && !loading && this.renderTable()}
        </div>
      </div>
    );
  }
}

export default DataViewer;
