import React from 'react';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved

import Field from './index.jsx';
import s from './field.css';

class File extends Field {
  onClick(event) {
    const { name, change } = this.props;
    const { dialog, BrowserWindow } = remote;
    const selected = dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      title: 'Select App Directory',
      buttonLabel: 'Select',
      properties: ['openDirectory'],
    });

    if (selected && change) {
      change(name, selected[0], event);
    }
  }

  renderInput() {
    const { name, value } = this.props;
    return (<div
      className={s['Field-input']}
      id={name}
      onClick={this.onClick}
    >
      {value}
    </div>);
  }
}

export default File;
