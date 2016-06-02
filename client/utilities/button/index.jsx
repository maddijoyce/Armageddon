import React, { PropTypes } from 'react';
import { compact } from 'underscore';

import Icon from '../icon';
import css from './button.css';

const propTypes = {
  name: PropTypes.string.isRequired,
  action: PropTypes.func,
  colour: PropTypes.string,
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
    const { colour, icon, label } = this.props;
    const classes = compact([
      css.Button,
      (colour ? css[`Button--${colour}`] : null),
    ]).join(' ');

    return (
      <button onClick={this.onClick} className={classes}>
        <Icon name={icon} size="2x" />
        <span className={css['Button-text']}>{label}</span>
      </button>
    );
  }
}

Button.propTypes = propTypes;

export default Button;
