import * as React from 'react';
import { Tag } from './App';
import TagList from './TagList';

interface Props {
  features: Array<string>;
  tags: Array<Tag>;
}

interface State {
  features: Array<string>;
  checkedFeatures: Array<string>;
  tags: Array<Tag>;
  filteredTags: Array<Tag>;
}

class TagSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      features: props.features,
      checkedFeatures: Array.from(props.features),
      tags: props.tags,
      filteredTags: Array.from(props.tags)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ features: nextProps.features,
                    checkedFeatures: nextProps.features,
                    tags: nextProps.tags,
                    filteredTags: nextProps.tags });
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target;
    let feature = target.getAttribute('data-feature') as string;
    let updatedFeatures = Array.from(this.state.checkedFeatures);
    let updatedTags = Array.from(this.state.tags);

    if (target.checked) {
      updatedFeatures.push(feature);
    } else {
      let index = updatedFeatures.indexOf(feature);
      updatedFeatures.splice(index, 1);
    }
    updatedTags = updatedTags.filter(tag => {
                                      return tag.features.some(feature => updatedFeatures.includes(feature));
                                     });
    this.setState({checkedFeatures: updatedFeatures, filteredTags: updatedTags});
  }

  renderFeatures(features: Array<string>) {
    return features.map((feature, index) => {
      return (
             <label key={index}>
               <input
                 className="featureInput"
                 key={index}
                 type="checkbox"
                 onChange={this.handleChange.bind(this)}
                 defaultChecked={true}
                 data-feature={feature}
               />
               {feature}
              </label>
              );
    });
  }

  render() {
    let { features } = this.props;
    return (
      <div className="featureFilter">
        {this.renderFeatures(features)}
        <TagList tags={this.state.filteredTags}/>
      </div>
    );
  }
}

export default TagSelector;
