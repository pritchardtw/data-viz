import * as React from 'react';
import { Tag, DataPoint } from './types/api_types';
import * as Chart from 'chart.js';
import './DataViewer.css';

interface DataViewerProps {
  tag: Tag;
}

interface DataViewerState {
  tagData: Array<DataPoint>;
  xaxis: Array<any>;
  yaxis: Array<any>;
  startTime: Date;
  endTime: Date;
}

interface DataViewer {
  tag: Tag;
}

class DataViewer extends React.Component<DataViewerProps, DataViewerState> {
  constructor(props: DataViewerProps) {
    super(props);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.tag = null;
    this.state = {
      tagData: [],
      xaxis: [],
      yaxis: [],
      endTime: new Date(2017, 10, 30),
      startTime: new Date(2017, 10, 28)
    };
  }

  updateTagData(tag: Tag) {
    const startTS = this.getApiDateString(this.state.startTime);
    const endTS = this.getApiDateString(this.state.endTime);
    fetch(`http://cs-mock-timeseries-api.azurewebsites.net/api/DataPoint/${tag.tagId}?startTS=${startTS}&endTS=${endTS}`)
    .then(response => {
      response.json()
      .then(data => {
        const xaxis = data.map((datapoint: DataPoint) => {
          return datapoint.observationTS;
        });
        const yaxis = data.map((datapoint: DataPoint) => {
          return datapoint.value;
        });
        this.setState({tagData: data, xaxis, yaxis}, () => {
          this.forceUpdate();
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

  componentDidUpdate() {
    let reversedXaxis = Array.from(this.state.xaxis);
    reversedXaxis.reverse();
    let reversedYaxis = Array.from(this.state.yaxis);
    reversedYaxis.reverse();
    let canvas = document.getElementById('graph') as HTMLCanvasElement;
    let parentDiv = canvas.parentNode as HTMLDivElement;
    parentDiv.removeChild(canvas);
    let newCanvas = document.createElement('canvas');
    newCanvas.width = 400;
    newCanvas.height = 400;
    newCanvas.id = 'graph';
    parentDiv.appendChild(newCanvas);
    const ctx = newCanvas.getContext('2d');
    new Chart(ctx, {
    type: 'line',
    data: {
        labels: reversedXaxis,
        datasets: [{
            label: this.props.tag.label,
            data: reversedYaxis,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
                }
            }]
        }
    }
});
  return '';
  }

  render() {
    const { startTime, endTime } = this.state;
    const startDate = this.getDateInputString(startTime);
    const endDate = this.getDateInputString(endTime);

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
          <canvas id="graph" width="400" height="400"/>
        </div>
      </div>
    );
  }
}

export default DataViewer;
