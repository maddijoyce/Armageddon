import React, { PropTypes } from 'react';
import css from './title.css';

const propTypes = {
  icon: PropTypes.bool.isRequired,
  label: PropTypes.string,
};

const defaultProps = {
  icon: true,
};

const Title = ({ icon, label }) => (
  <h1 className={css.Title}>
    {icon ? <img className={css['Title-icon']} src="images/IconHighlight@3x.png" alt="Icon" /> : ''}
    {label}
  </h1>
);

Title.propTypes = propTypes;
Title.defaultProps = defaultProps;

export default Title;
