import React, { PropTypes } from 'react';
import { keys, map } from 'lodash';

import { Bar, Button, Loading } from '../../utilities';
import Row from './row.jsx';
import css from './row.css';

const propTypes = {
  client: PropTypes.object.isRequired,
  apps: PropTypes.object,
  errors: PropTypes.object.isRequired,
  settings: PropTypes.object,
};

class Home extends React.Component {
  constructor() {
    super();
    this.setPage = this.setPage.bind(this);
    this.quit = this.quit.bind(this);
    this.renderApps = this.renderApps.bind(this);
  }

  setPage(page) {
    const { client } = this.props;
    client.request('page.set', page);
  }

  quit() {
    const { client } = this.props;
    client.request('quit');
  }

  renderApps() {
    const { apps, settings, client, errors } = this.props;

    if (!apps || !settings) {
      return <Loading />;
    } else if (!keys(apps).length) {
      return (<h3 className={css.Watermark}>You haven't added any apps.</h3>);
    }

    const { tld } = settings;
    return map(apps, (a, k) => (
      <Row key={k} error={errors[k]} client={client} tld={tld} {...a} />
    ));
  }

  render() {
    return (
      <div>
        <Bar>
          <Button
            name="add"
            label="Add App"
            icon="plus"
            action={this.setPage}
          />
          <Button
            name="settings"
            label="Settings"
            icon="wrench"
            action={this.setPage}
          />
          <Button
            name="quit"
            label="Quit"
            icon="times"
            colour="red"
            action={this.quit}
          />
        </Bar>
        <div className={css.Rows}>
          {this.renderApps()}
        </div>
      </div>
    );
  }
}

Home.propTypes = propTypes;

export default Home;
