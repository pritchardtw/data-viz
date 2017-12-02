import * as React from 'react';
import { Tag, DataPoint } from './types/api_types';
import './DataViewer.css';

interface DataViewerProps {
  tag: Tag;
}

interface DataViewerState {
  tagData: Array<DataPoint>;
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
    let startTime = new Date();
    startTime.setDate(startTime.getDate() - 2);
    this.state = {
      tagData: [],
      endTime: new Date(),
      startTime
    };
  }

  updateTagData(tag: Tag) {
    const startTS = this.getApiDateString(this.state.startTime);
    const endTS = this.getApiDateString(this.state.endTime);
    fetch(`http://cs-mock-timeseries-api.azurewebsites.net/api/DataPoint/${tag.tagId}?startTS=${startTS}&endTS=${endTS}`)
    .then(response => {
      response.json()
      .then(data => {
        this.setState({tagData: data});
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
    const dateArray = dateString.map(string => {
      return parseInt(string);
    });
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    this.setState({startTime: date}, () => {
      this.updateTagData(this.tag);
    });
  }

  updateEndDate(e: React.ChangeEvent<HTMLInputElement>) {
    const dateString = e.target.value.split('-');
    const dateArray = dateString.map(string => {
      return parseInt(string);
    });
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    this.setState({endTime: date}, () => {
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

  renderTagData() {
    return this.state.tagData.map((datapoint, index) => {
      return (
        <tr key={index}>
          <td>{datapoint.observationTS}</td>
          <td>{datapoint.value.toString()}</td>
        </tr>
      );
    });
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
              onChange={this.updateEndDate}
            />
          </div>
          <div className="start-date">
            <p>Start Date</p>
            <input
              type="date"
              defaultValue={startDate}
              onChange={this.updateStartDate}
            />
          </div>
        </div>
        <div className="data-display">
          <h2>{this.props.tag.label}</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Time Stamp</th>
                  <th>{this.props.tag.unit}</th>
                </tr>
              </thead>
              <tbody>
                {this.renderTagData()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default DataViewer;
