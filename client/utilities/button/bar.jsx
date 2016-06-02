import React, { PropTypes } from 'react';
import css from './button.css';

const propTypes = {
  children: PropTypes.array,
};

const Bar = ({ children }) => (
  <div className={css.Buttons}>
    {children}
  </div>
);

Bar.propTypes = propTypes;

export default Bar;
