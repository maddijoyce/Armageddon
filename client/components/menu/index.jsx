import React from 'react';
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
    app: { new: true, active: true },
  },
  edit: {
    body: Edit,
  },
  settings: {
    title: 'Settings',
    body: Settings,
  },
};

class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      page: pages.home,
      settings: null,
      apps: null,
      app: null,
    };

    this.client = new Client();
    this.client.on('pageChanged', (e, newPage) => {
      const { apps } = this.state;
      const [page, app] = newPage.split('/');
      this.setState({ page: pages[page], app: (apps || [])[app] });
    });
    this.client.on('settingsChanged', (e, settings) => {
      this.setState({ settings });
      this.client.request('initializeApps', { settings });
    });
    this.client.on('appsChanged', (e, apps) => {
      this.setState({ apps });
    });
    this.client.request('initializeSettings');
  }

  render() {
    const {
      page,
      settings,
      apps,
      app,
    } = this.state;

    return (
      <div className={css.Menu}>
        <Title label={page.title || app.domain} />
        <div className={css.Body}>
          <page.body
            client={this.client}
            settings={settings}
            apps={apps}
            app={app || page.app}
          />
        </div>
      </div>
    );
  }
}

export default Menu;
