import * as React from 'react';
import { Tag, DataPoint } from './types/api_types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as moment from 'moment';
import './DataViewer.css';

interface DataViewerProps {
  tag: Tag;
}

interface DataViewerState {
  tagData: Array<DataPoint>;
  startTime: any; // moment type
  endTime: any; // moment type TODO: figure out moment type
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
      startTime: moment().add(-2, 'days'),
      endTime: moment()
    };
  }

  updateTagData(tag: Tag) {
    const startTS = this.getDateString(this.state.startTime);
    const endTS = this.getDateString(this.state.endTime);
    fetch(`http://cs-mock-timeseries-api.azurewebsites.net/api/DataPoint/${tag.tagId}?startTS=${startTS}&endTS=${endTS}`)
    .then(response => {
      response.json()
      .then(data => {
        this.setState({tagData: data});
      });
    });
  }

  getDateString(date: any) {
    return `${date.year()}/${date.month() + 1}/${date.date()}`;
  }

  updateStartDate(date: any, e: any) {
    this.setState({startTime: date}, () => {
      this.updateTagData(this.tag);
    });
  }

  updateEndDate(date: any, e: any) {
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
    return(
      <div className="data-viewer">
        <div className="date-picker">
          <div className="end-date">
            <p>End Date</p>
            <DatePicker
              selected={this.state.endTime}
              onChange={this.updateEndDate}
              peekNextMonth={true}
              showMonthDropdown={true}
              showYearDropdown={true}
              dropdownMode="select"
            />
          </div>
          <div className="start-date">
            <p>Start Date</p>
            <DatePicker
              selected={this.state.startTime}
              onChange={this.updateStartDate}
              peekNextMonth={true}
              showMonthDropdown={true}
              showYearDropdown={true}
              dropdownMode="select"
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
