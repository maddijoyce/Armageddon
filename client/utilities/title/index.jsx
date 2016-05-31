import React, { PropTypes } from 'react';
import s from './title.css';

const propTypes = {
  icon: PropTypes.bool.isRequired,
  label: PropTypes.string,
};

const defaultProps = {
  icon: true,
};

const Title = ({ label }) => (
  <h1 className={s.Title}>
    <img className={s['Title-icon']} src="icon/IconHighlight@3x.png" alt="Icon" />
    {label}
  </h1>
);

Title.propTypes = propTypes;
Title.defaultProps = defaultProps;

export default Title;
