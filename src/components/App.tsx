import * as React from 'react';
import './App.css';
import TagSelector from './TagSelector';
import DataDisplay from './DataDisplay';
import { Tag } from './App';
import { RouteComponentProps, Route } from 'react-router-dom';

export interface Tag {
  features: Array<string>;
  label: string;
  tagId: string;
  id: number;
  dataType: string;
  unit: string;
}

interface State {
  features: Array<string>;
  tags: Array<Tag>;
}

class App extends React.Component<RouteComponentProps<any>, State> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.state = {
      features : [],
      tags : [],
    };
  }

  componentWillMount() {
    fetch('http://cs-mock-timeseries-api.azurewebsites.net/api/tag')
    .then(response => {
      response.json()
      .then((tags: Array<Tag>) => {
        let features = tags.reduce((featureList: Array<string>, tag: Tag) => {
                                      tag.features.forEach(feature => {
                                        if (!featureList.includes(feature)) {
                                          featureList.push(feature);
                                        }
                                      });
                                      return featureList;
                                    },
                                   []);
        tags = tags.map((tag, index) => {
          tag.id = index;
          return tag;
        });
        this.setState({features, tags});
      });
    });
  }

  render() {
    let { features, tags } = this.state;
    return (
      <div className="App">
          <TagSelector features={features} tags={tags} />
          <Route path={`${this.props.match.url}:id`} render={(props) => tags.length ? <DataDisplay {...props} tags={tags}/> : ''}/>
      </div>
    );
  }
}

export default App;
