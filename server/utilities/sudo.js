import sudo from 'sudo-prompt';

const cmdFnPath = require.resolve('cmd-fn');

export default function ({ module, method, params, cwd, type }, callback) {
  const cmd = [`"${process.execPath}"`, `"${cmdFnPath}"`];

  if (process.execPath.indexOf('Helper.app/Contents/MacOS') >= 0) {
    cmd.unshift('ATOM_SHELL_INTERNAL_RUN_AS_NODE=1');
  }
  if (module) {
    cmd.push('--module', module);

    if (method) cmd.push('--function', method);
    if (params) {
      const array = Array.isArray(params) ? params : [params];
      cmd.push('--params', `'${JSON.stringify(array)}'`);
    }
    if (cwd) cmd.push('--cwd', `'${cwd}'`);
    if (type) cmd.push(`--${type}`);

    sudo.exec(cmd.join(' '), {
      name: 'Armageddon',
      icns: `${process.cwd()}/client/images/Icon.icns`,
    }, (error, result) => {
      let parsed;
      try {
        parsed = JSON.parse(result);
      } catch (e) {
        parsed = result;
      }

      if (callback) callback(error, parsed);
    });
  } else if (callback) {
    callback(new Error('module option is required'));
  }
}
