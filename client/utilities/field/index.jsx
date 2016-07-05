import React, { PropTypes } from 'react';
import { compact } from 'lodash';
import css from './field.css';

import Icon from '../icon/index.jsx';

const propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  change: PropTypes.func,
};

const defaultProps = {
  type: 'text',
  value: '',
};

class Field extends React.Component {
  constructor() {
    super();
    this.state = {
      focus: false,
    };
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  onFocus() {}
  onChange(event) {
    const { name, change } = this.props;
    if (change) {
      change(name, event.target.value, event);
    }
  }

  renderInput() {
    const { name, type, value } = this.props;
    return (<input
      className={css['Field-input']}
      ref="input"
      name={name}
      id={name}
      type={type}
      value={value}
      onChange={this.onChange}
      onFocus={this.onFocus}
    />);
  }

  renderError() {
    const { error } = this.props;
    return (<span className={css['Field-label-error']}>
      {error}
    </span>);
  }

  render() {
    const { icon, label, value, error } = this.props;

    const classes = compact([
      css.Field,
      (error ? css['Field--error'] : null),
      (value ? css['Field--full'] : null),
    ]).join(' ');

    return (
      <div ref="field" className={classes}>
        {this.renderInput()}
        <label htmlFor={name} className={css['Field-label']}>
          <Icon name={icon} />
          <span className={css['Field-label-text']}>{label}</span>
          {this.renderError()}
        </label>
        <div className={css['Field-bar']} />
      </div>
    );
  }
}

Field.propTypes = propTypes;
Field.defaultProps = defaultProps;

export default Field;
