import React, { PropTypes } from 'react';
import { compact, extend, clone } from 'lodash';

import Field from './index.jsx';
import Icon from '../icon';
import css from './field.css';

const propTypes = extend(clone(Field.propTypes), {
  value: PropTypes.bool,
});

class CheckBox extends Field {
  onClick(event) {
    const { name, change, value } = this.props;

    if (change) {
      change(name, !value, event);
    }
  }

  render() {
    const { label, value } = this.props;
    const { focus } = this.state;

    const classes = compact([
      css.Field,
      (value ? css['Field--checked'] : null),
      (focus ? css['Field--focus'] : null),
    ]).join(' ');

    return (
      <div className={classes}>
        <input
          type="checkbox"
          className={css['Field-checkbox']}
          name={name}
          id={name}
          checked={value}
          onClick={this.onClick}
        />
        <label className={css['Field-label']}>
          <Icon name={value ? 'checkbox-checked' : 'checkbox-unchecked'} />
          <span className={css['Field-label-text']}>{label}</span>
        </label>
        <div className={css['Field-bar']} />
      </div>
    );
  }
}

CheckBox.propTypes = propTypes;

export default CheckBox;
