import React, { PropTypes } from 'react';
import path from 'path';

import { Button, Field, FileField, CheckBox, Loading } from '../../utilities';
import { Buttons } from '../../utilities/button/button.css';

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
    this.deleteApp = this.deleteApp.bind(this);
  }

  componentWillReceiveProps({ app }) {
    this.setState(app || {});
  }

  setPage(page) {
    const { client } = this.props;
    client.request('page.set', page);
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
    client.request('app.update', { settings, app });
    client.request('page.set', page);
  }

  deleteApp(page) {
    const app = this.state;
    const { client, settings } = this.props;
    client.request('app.delete', { settings, app });
    client.request('page.set', page);
  }

  render() {
    if (!this.state) return <Loading />;
    const { active, domain, directory } = this.state;

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
          {this.state.id ? <Button
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
        <CheckBox
          name="active"
          label="Active"
          value={active}
          change={this.setValue}
        />
        <FileField
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
      </div>
    );
  }
}

Edit.propTypes = propTypes;

export default Edit;
