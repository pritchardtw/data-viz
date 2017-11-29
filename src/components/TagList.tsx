// src/components/Hello.tsx
import * as React from 'react';
import { Tag } from './App';
import { Link } from 'react-router-dom';

export interface Props {
  tags: Array<Tag>;
}

class TagList extends React.Component<Props, {}> {
  renderTags(tags: Array<Tag>) {
    return tags.map((tag, index) => {
      return (
              <Link key={index} to={`${tag.id}`}>
                <li key={index}>{tag.label}</li>
              </Link>
             );
    });
  }

  render() {
    let { tags } = this.props;
    return (
      <div className="hello">
        <ul>
          {this.renderTags(tags)}
        </ul>
      </div>
    );
  }
}

export default TagList;
