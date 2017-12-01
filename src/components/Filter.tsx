import * as React from 'react';
import './Filter.css';

interface FilterProps {
  features: Array<string>;
  handleFilter: Function;
}

interface FilterState {
}

class Filter extends React.Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    let checked = e.target.checked;
    this.props.handleFilter(checked, e.target.getAttribute('data-feature'));
  }

  renderFeatures() {
    return this.props.features.map((feature, index) => {
      return (
        <li key={index}>
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={this.handleCheck}
            data-feature={feature}
          />
          <label>
            {feature}
          </label>
        </li>
      );
    });
  }

  render() {
    return(
      <ul className="filter">
        <h1>Filters</h1>
        {this.renderFeatures()}
      </ul>
    );
  }
}

export default Filter;
