import React, { PropTypes } from 'react';
import { compact, extend, clone } from 'lodash';

import Field from './index.jsx';
import Icon from '../icon';
import css from './field.css';

const propTypes = extend(clone(Field.propTypes), {
  value: PropTypes.bool,
});

class CheckBox extends Field {
  render() {
    const { label, value } = this.props;

    const classes = compact([
      css.Field,
      (value ? css['Field--checked'] : null),
    ]).join(' ');

    return (
      <div ref="field" className={classes}>
        <input
          type="checkbox"
          className={css['Field-checkbox']}
          name={name}
          id={name}
          checked={value}
          onChange={this.onChange}
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
