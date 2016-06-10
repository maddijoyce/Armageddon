import React, { PropTypes } from 'react';
import { compact } from 'lodash';
import css from './icon.css';

const propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  fixed: PropTypes.bool,
  size: PropTypes.string,
  animation: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

const defaultProps = {
  style: 'regular',
  loading: false,
};

const Icon = ({ name, style, fixed, size, animation, loading }) => {
  const icon = loading ? 'sync' : name;
  const classes = compact([
    css[`bt${style.charAt(0)}`],
    css[`bt-${icon}`],
    (fixed ? css['bt-fw'] : null),
    (size ? css[`bt-${size}`] : null),
    ((animation || loading) ? css[`bt-${loading ? 'spin' : animation}`] : null),
  ]).join(' ');

  return <i className={classes} alt={`${icon} icon`} />;
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
