const supportedEmojis = {
  ':)': 'smiley'
};
const newLineRegExp = "\\r?\\n";
const urlRegExp = 'https?://(www\.)?[a-zA-Z0-9-_\.]+(\.[a-zA-Z0-9]{2,})([-a-zA-Z0-9:%_\+.~#?&//=]*)';

function escapeRegExp(expression) {
  return expression.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export default class TextParser {
  constructor(lineBreak = true, emoji = true, url = true) {
    this._lineBreak = lineBreak;
    this._emoji = emoji;
    this._url = url;
  }

  _getCombinedMatcher() {
    var matchers = [];

    if (this._lineBreak) {
      matchers.push(newLineRegExp);
    }
    if (this._url) {
      matchers.push(urlRegExp);
    }
    if (this._emoji) {
      matchers = matchers.concat(Object.getOwnPropertyNames(supportedEmojis).map(escapeRegExp));
    }

    return new RegExp('(' + matchers.join('|') + ')', 'g');
  }

  parse(text) {
    var fragments = [];

    if (!this._lineBreak && !this._url && !this._emoji) {
      fragments.push({
        text: text,
        type: 'text'
      });

      return fragments;
    }

    const matcher = this._getCombinedMatcher();
    const newLineMatcher = new RegExp(newLineRegExp);
    var lastMatchingPos = 0;

    for (let match = matcher.exec(text); match !== null; match = matcher.exec(text)) {
      let afterPos = match.index + match[0].length;
      let isNewLine = newLineMatcher.test(match[0]);
      let whiteSpaceBefore = match.index === 0 || /\s/.test(text.charAt(match.index - 1));
      let whiteSpaceAfter = afterPos === text.length || /\s/.test(text.charAt(afterPos));

      if (isNewLine || (whiteSpaceBefore && whiteSpaceAfter)) {
        if (lastMatchingPos < match.index) {
          fragments.push({
            text: text.substring(lastMatchingPos, match.index),
            type: 'text'
          });
        }

        if (isNewLine) {
          fragments.push({
            text: '',
            type: 'newline'
          });
        } else if (supportedEmojis[match[0]]) {
          fragments.push({
            text: supportedEmojis[match[0]],
            type: 'emoji'
          });
        } else {
          // The regular experssion matches also with words after the url.
          // We are interested only in the url
          let url = match[0].split(/\s+/)[0];
          afterPos = match.index + url.length;

          fragments.push({
            text: url,
            type: 'url'
          });
        }

        lastMatchingPos = afterPos;
      }
    }

    if (lastMatchingPos < text.length) {
      fragments.push({
        text: text.substring(lastMatchingPos),
        type: 'text'
      });
    }

    return fragments;
  }
}
