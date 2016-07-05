import React, { PropTypes } from 'react';

import { Bar, Button, Field, Loading } from '../../utilities';

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
    this.setState(settings);
  }

  setPage(page) {
    const { client } = this.props;
    client.request('page.set', page);
  }

  setValue(name, value) {
    const state = {};
    state[name] = value;
    this.setState(state);
  }

  updateSettings(page) {
    const { client } = this.props;
    client.request('settings.update', this.state);
    client.request('page.set', page);
  }

  renderForm() {
    const { tld } = this.state;
    return (<div>
      <h5><span>Armageddon Options</span></h5>
      <Field
        name="tld"
        label="Top Level Domain"
        icon="globe"
        value={tld}
        change={this.setValue}
      />
    </div>);
  }

  render() {
    return (
      <div>
        <Bar>
          <Button
            name="home"
            label="Cancel"
            icon="arrow-left"
            colour="silver"
            action={this.setPage}
          />
          <Button
            name="home"
            label="Update"
            icon="check"
            colour="green"
            action={this.updateSettings}
          />
        </Bar>
        {this.state ? this.renderForm() : <Loading />}
      </div>
    );
  }
}

Settings.propTypes = propTypes;

export default Settings;
