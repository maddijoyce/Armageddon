import React, { PropTypes } from 'react';

import { Icon } from '../../utilities';
import s from './row.css';

const propTypes = {
  client: PropTypes.object,
  tld: PropTypes.string,
  id: PropTypes.string,
  domain: PropTypes.string,
  port: PropTypes.number,
};

class Row extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { client, id } = this.props;
    client.request('setPage', `edit/${id}`);
  }

  render() {
    const { domain, port, tld } = this.props;
    return (
      <div className={s.Row} onClick={this.onClick}>
        <div className={s['Row-info']}>
          <h3 className={s['Row-title']}>
            <Icon name="globe" style="solid" fixed /> {domain}.{tld}
          </h3>
          <h4 className={s['Row-subtitle']}>
            <Icon name="rss" style="solid" fixed /> localhost:{port}
          </h4>
        </div>
      </div>
    );
  }
}

Row.propTypes = propTypes;

export default Row;
