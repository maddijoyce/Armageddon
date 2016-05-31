import React, { PropTypes } from 'react';

import { Button, Field, Loading } from '../../utilities';

const propTypes = {
  client: PropTypes.object.isRequired,
  settings: PropTypes.object,
};

class Settings extends React.Component {
  constructor({ settings }) {
    super();
    this.state = settings;
    this.setPage = this.setPage.bind(this);
    this.setValue = this.setValue.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  componentWillReceiveProps({ settings }) {
    if (settings) this.setState(settings);
  }

  setPage(page) {
    const { client } = this.props;
    client.request('setPage', page);
  }

  setValue(name, value) {
    const state = {};
    state[name] = value;
    this.setState(state);
  }

  updateSettings(page) {
    const { client } = this.props;
    client.request('updateSettings', this.state);
    client.request('setPage', page);
  }

  render() {
    if (!this.state) return <Loading />;
    const { tld } = this.state;

    return (
      <div>
        <Field
          name="tld"
          label="Top Level Domain"
          icon="globe"
          value={tld}
          change={this.setValue}
        />
        <Button
          name="home"
          label="Cancel"
          icon="arrow-left"
          colour="white"
          size="half"
          action={this.setPage}
        />
        <Button
          name="home"
          label="Update"
          icon="upload"
          size="half"
          action={this.updateSettings}
        />
      </div>
    );
  }
}

Settings.propTypes = propTypes;

export default Settings;
