import React, { PropTypes } from 'react';
import { keys, map } from 'underscore';

import { Button, Loading } from '../../utilities';
import Row from './row.jsx';
import s from './row.css';

const propTypes = {
  client: PropTypes.object.isRequired,
  apps: PropTypes.object,
  settings: PropTypes.object,
};

class Home extends React.Component {
  constructor() {
    super();
    this.setPage = this.setPage.bind(this);
    this.renderApps = this.renderApps.bind(this);
  }

  setPage(page) {
    const { client } = this.props;
    client.request('setPage', page);
  }

  renderApps() {
    const { apps, settings, client } = this.props;

    if (!apps || !settings) {
      return <Loading />;
    } else if (!keys(apps).length) {
      return (<h3 className={s.Watermark}>You haven't added any apps.</h3>);
    }

    const { tld } = settings;
    return map(apps, (a, k) => (<Row key={k} client={client} tld={tld} {...a} />));
  }

  render() {
    return (
      <div>
        <div className={s.Rows}>
          {this.renderApps()}
        </div>
        <Button
          name="add"
          label="Add"
          icon="plus"
          size="half"
          action={this.setPage}
        />
        <Button
          name="settings"
          label="Settings"
          icon="wrench"
          size="half"
          action={this.setPage}
        />
      </div>
    );
  }
}

Home.propTypes = propTypes;

export default Home;
