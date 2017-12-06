import * as React from 'react';
import { Tag } from './types/api_types';
import TagList from './TagList';
import Filter from './Filter';
import DataViewer from './DataViewer';
import './App.css';

interface AppProps {
}

interface AppState {
  updatedFeatures: Array<string>;
  updatedTags: Array<Tag>;
  selectedTag: Tag;
}

interface App {
  features: Array<string>;
  tags: Array<Tag>;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSelectTag = this.handleSelectTag.bind(this);
    this.features = [];
    this.tags = [];
    this.state = {
      updatedFeatures: [],
      updatedTags: [],
      selectedTag: null
    };
  }

  componentDidMount() {
    fetch('http://cs-mock-timeseries-api.azurewebsites.net/api/Tag')
    .then(response => {
      response.json()
      .then((tags: Array<Tag>) => {
        let features = tags.reduce((featureList: Array<string>, tag) => {
          tag.features.forEach(feature => {
            if (!featureList.includes(feature)) {
              featureList.push(feature);
            }
          });
          return featureList;
        },
                                   []);
        this.features = Array.from(features);
        this.tags = Array.from(tags);
        this.setState({updatedFeatures: features, updatedTags: tags});
      });
    });
  }

  handleFilter(checked: Boolean, feature: string) {
    let newFeatures = Array.from(this.state.updatedFeatures);
    if (checked) {
      newFeatures.push(feature);
    } else {
      let index = newFeatures.indexOf(feature);
      newFeatures.splice(index, 1);
    }
    let newTags = this.tags.filter(tag => {
      return tag.features.some(tagFeature => {
        return newFeatures.includes(tagFeature);
      });
    });
    this.setState({updatedTags: newTags, updatedFeatures: newFeatures});
  }

  handleSelectTag(tag: Tag) {
    this.setState({selectedTag: tag});
  }

  render() {
    return(
      <div className="app">
        <h1>Welcome to Data Viewer</h1>
        {this.features.length ? <Filter features={this.features} handleFilter={this.handleFilter} /> : null}
        {this.state.updatedTags.length ?
          <TagList
            tags={this.state.updatedTags}
            handleSelectTag={this.handleSelectTag}
          />
           :
           null}
        {this.state.selectedTag ? <DataViewer tag={this.state.selectedTag} /> : null}
      </div>
    );
  }
}

export default App;
