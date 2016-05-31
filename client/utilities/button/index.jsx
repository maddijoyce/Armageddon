import React, { PropTypes } from 'react';
import { compact } from 'underscore';

import Icon from '../icon';
import s from './button.css';

const propTypes = {
  name: PropTypes.string.isRequired,
  action: PropTypes.func,
  colour: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};


class Button extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    const { name, action } = this.props;
    if (action) {
      event.preventDefault();
      action(name, event);
    }
  }

  render() {
    const { size, colour, icon, label } = this.props;
    const classes = compact([
      s.Button,
      (colour ? s[`Button--${colour}`] : null),
      (size ? s[`Button--${size}`] : null),
    ]).join(' ');

    return (
      <button onClick={this.onClick} className={classes}>
        <Icon name={icon} size="lg" />
        <span className={s['Button-text']}>{label}</span>
      </button>
    );
  }
}

Button.propTypes = propTypes;

export default Button;
