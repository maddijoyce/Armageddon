import React from 'react';
import { remote } from 'electron'; // eslint-disable-line import/no-unresolved

import Field from './index.jsx';
import css from './field.css';

class FileField extends Field {
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
      className={css['Field-input']}
      id={name}
      onClick={this.onClick}
    >
      {value}
    </div>);
  }
}

export default FileField;
