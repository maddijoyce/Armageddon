import React, { PropTypes } from 'react';
import { compact } from 'lodash';
import css from './icon.css';

const propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  fixed: PropTypes.bool,
  size: PropTypes.string,
  colour: PropTypes.string,
  animation: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

const defaultProps = {
  style: 'regular',
  loading: false,
};

const Icon = ({ name, style, fixed, size, colour, animation, loading }) => {
  const classes = compact([
    css[`bt${style.charAt(0)}`],
    css[`bt-${loading ? 'sync' : name}`],
    (fixed ? css['bt-fw'] : null),
    (size ? css[`bt-${size}`] : null),
    (colour ? css[`${colour} fg`] : null),
    ((animation || loading) ? css[`bt-${loading ? 'spin' : animation}`] : null),
  ]).join(' ');

  return <i className={classes} alt={`${name} icon`} />;
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
