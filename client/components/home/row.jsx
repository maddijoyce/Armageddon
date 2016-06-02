import { shell } from 'electron'; // eslint-disable-line import/no-unresolved
import React, { PropTypes } from 'react';

import { Button, Icon, Loading } from '../../utilities';
import css from './row.css';

const propTypes = {
  client: PropTypes.object,
  tld: PropTypes.string,
  id: PropTypes.string,
  active: PropTypes.bool,
  domain: PropTypes.string,
  port: PropTypes.number,
  error: PropTypes.string,
  loading: PropTypes.string,
};

class Row extends React.Component {
  constructor() {
    super();
    this.edit = this.edit.bind(this);
  }

  edit() {
    const { client, id } = this.props;
    client.request('setPage', `edit/${id}`);
  }
  logs() {
    console.log('aoeu');
  }

  open(event) {
    event.preventDefault();
    shell.openExternal(event.currentTarget.href);
  }

  renderStatus() {
    const { active, error } = this.props;
    const classes = [css['Row-subtitle']];
    let status;
    let icon;

    if (error) {
      classes.push(css['Row-subtitle--red']);
      status = error;
      icon = 'exclamation-circle';
    } else if (active) {
      classes.push(css['Row-subtitle--blue']);
      status = 'RUNNING';
      icon = 'wifi';
    } else {
      status = 'STOPPED';
      icon = 'pause';
    }

    return (<h4 className={classes.join(' ')}>
      <Icon name={icon} style="solid" fixed /> {status}
    </h4>);
  }

  render() {
    const { domain, tld, loading } = this.props;

    return (
      <div className={css.Row}>
        {loading ? <Loading label={loading} /> : ''}
        <h3 className={css['Row-title']}>
          <a href={`http://${domain}.${tld}`} onClick={this.open} className={css['Row-link']}>
            <Icon name="globe" style="solid" fixed /> {domain}.{tld}
          </a>
        </h3>
        {this.renderStatus()}
        <div className={css['Row-buttons']}>
          <Button
            name="home"
            label="Edit"
            icon="pencil"
            colour="inverse"
            action={this.edit}
          />
          <Button
            name="logs"
            label="Logs"
            icon="align-justify"
            colour="inverse"
            action={this.logs}
          />
        </div>
      </div>
    );
  }
}

Row.propTypes = propTypes;

export default Row;
