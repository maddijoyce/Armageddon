import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
import path from 'path';

import cssPalette from 'postcss-color-palette';
import cssSimpleVars from 'postcss-simple-vars';
import cssFontPath from 'postcss-fontpath';
import cssCalc from 'postcss-calc';
import cssUrl from 'postcss-url';

export const rootDir = path.join(remote.app.getAppPath(), 'client');
export const prepend = [
  cssPalette({
    palette: {
      blue: '#235874',
      navy: '#0085ea',
      white: '#ffffff',
      silver: '#f3f3f4',
      gray: '#787883',
      black: '#37373c',
    },
  }),
  cssSimpleVars(),
  cssCalc(),
];
export const append = [
  cssFontPath(),
  cssUrl({
    url(url) {
      return `file://${path.join(rootDir, url)}`;
    },
  }),
];
export const processCss = (css) => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  document.head.appendChild(style);
};
