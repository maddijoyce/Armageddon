import React from 'react';
import ReactDOM from 'react-dom';

import Menu from './components/menu';

window.onload = () => {
  ReactDOM.render(
    <Menu />,
    document.getElementById('container')
  );
};
