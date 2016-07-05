import { remote } from 'electron'; // eslint-disable-line import/no-unresolved

import Field from './index.jsx';

class FileField extends Field {
  onFocus(event) {
    const { name, change } = this.props;
    const { dialog, BrowserWindow } = remote;
    const selected = dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      title: 'Select App Directory',
      buttonLabel: 'Select',
      properties: ['openDirectory'],
    });

    if (change) {
      change(name, selected ? selected[0] : '', event);
    }
    this.refs.input.blur();
  }
}

export default FileField;
