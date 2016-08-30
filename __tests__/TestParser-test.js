jest.dontMock('../src/helpers/TextParser');

describe('Text Parser', () => {
  var instance;

  beforeEach(() => {
    var TextParser = require('../src/helpers/TextParser').default;
    instance = new TextParser();
  });

  it('should enable url parsing by default', () => {
    expect(instance._url).toBe(true);
  });

  it('should enable emoji parsing by default', () => {
    expect(instance._emoji).toBe(true);
  });

  it('should enable line-break parsing by default', () => {
    expect(instance._lineBreak).toBe(true);
  });

  it('should parse all the featured text-elements', () => {
    expect(instance.parse(":) really-really long emoji-improved:) :) Test message http://google.com with url\n123\r\n:)")).toEqual([
      {
        text: 'smiley',
        type: 'emoji'
      },
      {
        text: ' really-really long emoji-improved:) ',
        type: 'text'
      },
      {
        text: 'smiley',
        type: 'emoji'
      },
      {
        text: ' Test message ',
        type: 'text'
      },
      {
        text: 'http://google.com',
        type: 'url'
      },
      {
        text: ' with url',
        type: 'text'
      },
      {
        text: '',
        type: 'newline'
      },
      {
        text: '123',
        type: 'text'
      },
      {
        text: '',
        type: 'newline'
      },
      {
        text: 'smiley',
        type: 'emoji'
      }
    ]);
  });

  describe('when all featured text-elements\' parsing is disabled', () => {
    const SAMPLE_TEXT = "this :) text\nhas\r\nall the featured http://www.google.com items";

    beforeEach(() => {
      instance._url = false;
      instance._emoji = false;
      instance._lineBreak = false;
    });

    it('should return the original text in a single token', () => {
      expect(instance.parse(SAMPLE_TEXT)).toEqual([{
        text: SAMPLE_TEXT,
        type: 'text'
      }]);
    });
  });

  describe('when emoji parseing is enabled', () => {
    beforeEach(() => {
      instance._emoji = true;
      instance._url = false;
      instance._lineBreak = false;
    });

    it('should parse the emoji as the only part of the text', () => {
      expect(instance.parse(':)')).toEqual([{
        type: 'emoji',
        text: 'smiley'
      }]);
    });

    it('should parse the emoji at the beginning of the text if it\'s followed by whitespace character', () => {
      expect(instance.parse(':) text')).toEqual([
        {
          type: 'emoji',
          text: 'smiley'
        },
        {
          type: 'text',
          text: ' text'
        }
      ]);
    });

    it('should parse the emoji at the end of the text if it\'s lead by whitespace character', () => {
      expect(instance.parse('text :)')).toEqual([
        {
          type: 'text',
          text: 'text '
        },
        {
          type: 'emoji',
          text: 'smiley'
        }
      ]);

      expect(instance.parse("text\n:)")).toEqual([
        {
          type: 'text',
          text: "text\n"
        },
        {
          type: 'emoji',
          text: 'smiley'
        }
      ]);
    });

    it('should not parse the emoji if it is connected to other text fragments', () => {
      var SAMPLE_TEXT = 'text:)';

      expect(instance.parse(SAMPLE_TEXT)).toEqual([{
        type: 'text',
        text: SAMPLE_TEXT
      }]);

      SAMPLE_TEXT = ':)text';

      expect(instance.parse(SAMPLE_TEXT)).toEqual([{
        type: 'text',
        text: SAMPLE_TEXT
      }]);
    });
  });

  describe('when line break parsing is enabled', () => {
    beforeEach(() => {
      instance._lineBreak = true;
      instance._emoji = false;
      instance._url = false;
    });

    it('should parse line break without carriage return', () => {
      expect(instance.parse("test \n test")).toEqual([
        {
          type: 'text',
          text: 'test '
        },
        {
          type: 'newline',
          text: ''
        },
        {
          type: 'text',
          text: ' test'
        },
      ]);
    });

    it('should parse line break with carriage return', () => {
      expect(instance.parse("test \r\n test")).toEqual([
        {
          type: 'text',
          text: 'test '
        },
        {
          type: 'newline',
          text: ''
        },
        {
          type: 'text',
          text: ' test'
        },
      ]);
    });

    it('should parse line break surrounded by text', () => {
      expect(instance.parse("test\ntest")).toEqual([
        {
          type: 'text',
          text: 'test'
        },
        {
          type: 'newline',
          text: ''
        },
        {
          type: 'text',
          text: 'test'
        },
      ]);
    });

    it('should parse multiple consecutive line breaks', () => {
      expect(instance.parse("test\n\r\ntest")).toEqual([
        {
          type: 'text',
          text: 'test'
        },
        {
          type: 'newline',
          text: ''
        },
        {
          type: 'newline',
          text: ''
        },
        {
          type: 'text',
          text: 'test'
        },
      ]);
    });
  });

  describe('when url parsing is enabled', () => {
    const TEST_URL = 'http://www.google.com';

    beforeEach(() => {
      instance._url = true;
      instance._lineBreak = false;
      instance._emoji = false;
    });

    it('should parse the url as the only part of the text', () => {
      expect(instance.parse(TEST_URL)).toEqual([{
        type: 'url',
        text: TEST_URL
      }]);
    });

    it('should parse the emoji at the beginning of the text if it\'s followed by whitespace character', () => {
      expect(instance.parse(TEST_URL + ' text')).toEqual([
        {
          type: 'url',
          text: TEST_URL
        },
        {
          type: 'text',
          text: ' text'
        }
      ]);
    });

    it('should parse the emoji at the end of the text if it\'s lead by whitespace character', () => {
      expect(instance.parse('text ' + TEST_URL)).toEqual([
        {
          type: 'text',
          text: 'text '
        },
        {
          type: 'url',
          text: TEST_URL
        }
      ]);

      expect(instance.parse("text\n" + TEST_URL)).toEqual([
        {
          type: 'text',
          text: "text\n"
        },
        {
          type: 'url',
          text: TEST_URL
        }
      ]);
    });

    it('should not parse the emoji if it is connected to other text fragments', () => {
      const SAMPLE_TEXT = 'text' + TEST_URL;

      expect(instance.parse(SAMPLE_TEXT)).toEqual([{
        type: 'text',
        text: SAMPLE_TEXT
      }]);
    });
  });
});
