import menubar from 'menubar';

var menu = menubar();

menu.on('ready', () => {
  console.log('app is ready');
});
