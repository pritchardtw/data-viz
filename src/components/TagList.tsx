import * as React from 'react';
import { Tag } from './types/api_types';
import './TagList.css';

interface TagListProps {
  tags: Array<Tag>;
  handleSelectTag: Function;
}

interface TagListState {
}

class TagList extends React.Component<TagListProps, TagListState> {
  constructor(props: TagListProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLLIElement>) {
    let target = e.target as HTMLLIElement;
    this.props.handleSelectTag(this.props.tags[target.getAttribute('data-key')]);
  }

  renderTags() {
    return this.props.tags.map((tag, index) => {
      return (
        <li
          key={index}
          data-key={index}
          onClick={this.handleClick}
        >
          {tag.label}
        </li>
      );
    });
  }

  render() {
    return(
      <ul className="tag-list">
        <h1>Tags</h1>
        {this.renderTags()}
      </ul>
    );
  }
}

export default TagList;
