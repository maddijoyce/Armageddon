import React, { PropTypes } from 'react';
import css from './loading.css';

const propTypes = {
  label: PropTypes.string.isRequired,
};

const defaultProps = {
  label: 'Loading...',
};

const Loading = ({ label }) => (
  <div className={css.Fade}>
    <div className={css.Loading}>
      <div className={css['Loading-text']}>{label}</div>
      <div className={css['Loading-bar']}>
        <div className={css['Loading-progress']} />
      </div>
    </div>
  </div>
);

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
