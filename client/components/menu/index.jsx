import React, { PropTypes } from 'react';
import Client from 'electron-rpc/client';

import { Title } from '../../utilities';
import Home from '../home';
import Edit from '../edit';
import Settings from '../settings';

import css from './menu.css';

const pages = {
  home: {
    title: 'Armageddon',
    body: Home,
  },
  add: {
    title: 'Add App',
    body: Edit,
    app: { active: true },
  },
  edit: {
    body: Edit,
  },
  settings: {
    title: 'Settings',
    body: Settings,
  },
};

const propTypes = {
  client: PropTypes.object,
};

const defaultProps = {
  client: new Client(),
};

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: pages.home,
      settings: null,
      apps: null,
      app: null,
    };

    const { client } = props;
    client.on('page.changed', (e, newPage) => {
      const { apps } = this.state;
      const [page, app] = newPage.split('/');
      this.setState({ page: pages[page] });
      if (apps && app) {
        this.setState({ app: apps[app] });
      } else {
        this.setState({ app: null });
      }
    });
    client.on('settings.changed', (e, settings) => {
      this.setState({ settings });
      client.request('apps.initialize', { settings });
    });
    client.on('apps.changed', (e, apps) => {
      this.setState({ apps });
    });
    client.request('settings.initialize');
  }

  render() {
    const {
      page,
      settings,
      apps,
      app,
    } = this.state;
    const {
      client,
    } = this.props;

    return (
      <div className={css.Menu}>
        <Title label={page.title || (app && app.domain)} />
        <div className={css.Body}>
          <page.body
            client={client}
            settings={settings}
            apps={apps}
            app={app || page.app}
          />
        </div>
      </div>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

export default Menu;
