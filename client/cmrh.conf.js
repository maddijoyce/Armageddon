import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
import path from 'path';

import cssPalette from 'postcss-palette';
import cssColor from 'postcss-color-function';
import cssSimpleVars from 'postcss-simple-vars';
import cssFontPath from 'postcss-fontpath';
import cssCalc from 'postcss-calc';
import cssUrl from 'postcss-url';

export const rootDir = path.join(remote.app.getAppPath(), 'client');
export const prepend = [
  cssPalette({
    palette: {
      navy: '#235874',
      blue: '#0085ea',
      aqua: '#7FDBFF',
      teal: '#39CCCC',
      olive: '#3D9970',
      green: '#2ECC40',
      lime: '#01FF70',
      yellow: '#FFDC00',
      orange: '#FF851B',
      red: '#FF4136',
      fuchsia: '#F012BE',
      purple: '#B10DC9',
      maroon: '#85144B',
      white: '#FFFFFF',
      silver: '#f3f3f4',
      gray: '#787883',
      black: '#37373c',
    },
  }),
  cssColor(),
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
