//const textTable = require('text-table');
const repeating = require('repeating');
const stringWidth = require('string-width');
const stringify = require('json-stringify-safe');
const chalk = require('chalk');

const defaults = {
  color: true,
  separator: '  ::  ',
  appColumnWidth: 15,
  tagColor: 'dim',
  tagColors: {
    error: 'red',
    warning: 'yellow',
    success: 'green'
  },
  appColors: {}
};
const availableColors = [
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan'
];
let lastColorIndex = 0;

module.exports = function(options, tags, message) {
  options = Object.assign({}, defaults, options);

  //first tag is considered the app
  let app = tags.shift() || '';
  const appWidth = stringWidth(app);

  if (typeof message === 'object') {
    message = stringify(message, null, options.appColumnWidth + 4);
  }

  if (options.color) {
    if (!options.appColors[app]) {
      options.appColors[app] = availableColors[lastColorIndex];
      lastColorIndex++;
      if (lastColorIndex > availableColors.length - 1) {
        lastColorIndex = 0;
      }
    }
    app = chalk[options.appColors[app]](app);
    tags.forEach((tag, i) => {
      const color = options.tagColors[tag] ? chalk[options.tagColors[tag]] : chalk[options.tagColor];
      tags[i] = color(tag);
    });
    options.separator = chalk.dim(options.separator);
  }
  let tagString = '';
  if (tags.length !== 0) {
    tagString = ` [${tags.join(',')}]`;
  }
  const tagsWidth = stringWidth(tagString);
  let appIndent = options.appColumnWidth - appWidth - tagsWidth;
  if (appIndent < 0) {
    appIndent = 0;
  }

  const msg = `${repeating(appIndent)}${app}${tagString}${options.separator}${message}`;
  return msg;
};
