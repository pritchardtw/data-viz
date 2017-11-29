import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tag } from './App';

interface Props extends RouteComponentProps<any> {
  tags: Array<Tag>;
}

interface State {
  values: Array<any>;
  tag: Tag;
}

interface DataPoint {
  value: any;
}

class DataDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tag: this.props.tags[this.props.match.params.id],
      values: []
    };
  }

  getDateString(date: Date) {
    return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  }

  componentWillMount() {
    let tagId = this.state.tag.tagId;
    let end = new Date();
    let start = new Date();
    start.setDate(end.getDate() - 2);
    let startTS = this.getDateString(start);
    let endTS = this.getDateString(end);
    fetch(`http://cs-mock-timeseries-api.azurewebsites.net/api/DataPoint/${tagId}?startTS=${startTS}&endTS=${endTS}`)
    .then(response => {
      response.json()
      .then((datapoints: Array<DataPoint>) => {
          let values = datapoints.map(point => point.value);
          console.log(values);
          this.setState({values});
      });
    });
  }

  renderValues() {
    return this.state.values.map((value, index) => {
      return <div key={index}>{value.toString()}</div>;
    });
  }

  render() {
    let renderInfo = false;
    if (this.props.tags.length && this.state.tag) {
      renderInfo = true;
    }
    return(
        <div>
             {this.state.tag ? this.state.tag.unit : ''}
             {this.renderValues()}
        </div>
      );
  }
}

export default DataDisplay;
