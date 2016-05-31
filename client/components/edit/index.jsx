import React, { PropTypes } from 'react';
import path from 'path';

import { Button, Field, File, Loading } from '../../utilities';

const propTypes = {
  client: PropTypes.object.isRequired,
  settings: PropTypes.object,
  app: PropTypes.object,
};

class Edit extends React.Component {
  constructor({ app }) {
    super();
    this.state = app;
    this.setPage = this.setPage.bind(this);
    this.setValue = this.setValue.bind(this);
    this.saveApp = this.saveApp.bind(this);
  }

  componentWillReceiveProps({ app }) {
    if (app) this.setState(app);
  }

  setPage(page) {
    const { client } = this.props;
    client.request('setPage', page);
  }

  setValue(name, value) {
    const state = {};
    state[name] = value;

    if (name === 'directory' && !this.state.domain) {
      const parsed = path.parse(value);
      state.domain = parsed.base;
    }

    this.setState(state);
  }

  saveApp(page) {
    const app = this.state;
    const { client, settings } = this.props;
    client.request('updateApp', { settings, app });
    client.request('setPage', page);
  }

  render() {
    if (!this.state) return <Loading />;
    const { domain, directory } = this.state;

    return (
      <div>
        <File
          name="directory"
          label="Directory"
          icon="folder"
          value={directory}
          change={this.setValue}
        />
        <Field
          name="domain"
          label="Domain"
          icon="cloud"
          value={domain}
          change={this.setValue}
        />
        <Button
          name="home"
          label="Cancel"
          icon="arrow-left"
          colour="gray"
          size="half"
          action={this.setPage}
        />
        <Button
          name="home"
          label="Save"
          icon="upload"
          size="half"
          action={this.saveApp}
        />
      </div>
    );
  }
}

Edit.propTypes = propTypes;

export default Edit;
