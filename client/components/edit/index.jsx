import React, { PropTypes } from 'react';
import path from 'path';
import { filter, clone } from 'lodash';

import { Button, Field, FileField, CheckBox, Loading } from '../../utilities';
import { Buttons } from '../../utilities/button/button.css';

import { App } from '../../../models';

const propTypes = {
  client: PropTypes.object.isRequired,
  settings: PropTypes.object,
  app: PropTypes.object,
};

class Edit extends React.Component {
  constructor({ app }) {
    super();

    this.state = {
      app: clone(app),
      error: {},
    };

    this.setPage = this.setPage.bind(this);
    this.setValue = this.setValue.bind(this);
    this.saveApp = this.saveApp.bind(this);
    this.deleteApp = this.deleteApp.bind(this);
  }

  componentWillReceiveProps({ app }) {
    this.setState({
      app: clone(app),
    });
  }

  setPage(page) {
    const { client } = this.props;
    client.request('page.set', page);
  }

  setValue(name, value) {
    const { app, error } = this.state;
    app[name] = value;
    error[name] = App.checkField(name, value)[0];

    if (value && name === 'directory' && !app.domain) {
      const parsed = path.parse(value);
      app.domain = parsed.base;
      error.domain = App.checkField('domain', app.domain)[0];
    }

    this.setState({ app, error });
  }

  saveApp(page) {
    const { app } = this.state;
    const error = App.checkFields(app);

    if (filter(error).length) {
      this.setState({ error });
    } else {
      const { client, settings } = this.props;
      client.request('app.update', { settings, app });
      client.request('page.set', page);
    }
  }

  deleteApp(page) {
    const { app } = this.state;
    const { client, settings } = this.props;
    client.request('app.delete', { settings, app });
    client.request('page.set', page);
  }

  render() {
    const { app, error } = this.state;
    if (!app) return <Loading />;
    const { id, active, domain, directory, settings, production } = app;

    return (
      <div>
        <div className={Buttons}>
          <Button
            name="home"
            label="Cancel"
            icon="arrow-left"
            colour="silver"
            action={this.setPage}
          />
          {id ? <Button
            name="home"
            label="Delete"
            icon="minus"
            colour="red"
            action={this.deleteApp}
          /> : ''}
          <Button
            name="home"
            label="Save"
            icon="check"
            colour="green"
            action={this.saveApp}
          />
        </div>
        <h5><span>Armageddon Options</span></h5>
        <CheckBox
          name="active"
          label="Active"
          value={active}
          error={error.active}
          change={this.setValue}
        />
        <FileField
          name="directory"
          label="Directory"
          icon="folder"
          value={directory}
          error={error.directory}
          change={this.setValue}
        />
        <Field
          name="domain"
          label="Domain"
          icon="cloud"
          value={domain}
          error={error.domain}
          change={this.setValue}
        />
        <h5><span>Meteor Options</span></h5>
        <Field
          name="settings"
          label="Settings File"
          icon="gear"
          value={settings}
          error={error.settings}
          change={this.setValue}
        />
        <CheckBox
          name="production"
          label="Production Mode"
          value={production}
          error={error.production}
          change={this.setValue}
        />
      </div>
    );
  }
}

Edit.propTypes = propTypes;

export default Edit;
