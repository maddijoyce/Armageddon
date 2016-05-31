import React, { PropTypes } from 'react';
import s from './loading.css';

const propTypes = {
  label: PropTypes.string.isRequired,
};

const defaultProps = {
  label: 'Loading...',
};

const Loading = ({ label }) => (
  <div className={s.Loading}>
    <div className={s['Loading-text']}>{label}</div>
    <div className={s['Loading-bar']}>
      <div className={s['Loading-progress']} />
    </div>
  </div>
);

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
