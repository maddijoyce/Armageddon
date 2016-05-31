import React, { PropTypes } from 'react';
import { compact } from 'underscore';
import s from './icon.css';

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
    s[`bt${style.charAt(0)}`],
    s[`bt-${loading ? 'sync' : name}`],
    (fixed ? s['bt-fw'] : null),
    (size ? s[`bt-${size}`] : null),
    (colour ? s[`${colour} fg`] : null),
    ((animation || loading) ? s[`bt-${loading ? 'spin' : animation}`] : null),
  ]).join(' ');

  return <i className={classes} />;
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
