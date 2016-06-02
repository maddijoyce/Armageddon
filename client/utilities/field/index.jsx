import React, { PropTypes } from 'react';
import { compact } from 'underscore';
import css from './field.css';

import Icon from '../icon';

const propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
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
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  onClick() {}
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
      name={name}
      id={name}
      type={type}
      value={value}
      onChange={this.onChange}
      onClick={this.onClick}
    />);
  }

  render() {
    const { icon, label, value } = this.props;
    const { focus } = this.state;

    const classes = compact([
      css.Field,
      (value ? css['Field--full'] : null),
      (focus ? css['Field--focus'] : null),
    ]).join(' ');

    return (
      <div className={classes}>
        {this.renderInput()}
        <label className={css['Field-label']}>
          <Icon name={icon} />
          <span className={css['Field-label-text']}>{label}</span>
        </label>
        <div className={css['Field-bar']} />
      </div>
    );
  }
}

Field.propTypes = propTypes;
Field.defaultProps = defaultProps;

export default Field;
