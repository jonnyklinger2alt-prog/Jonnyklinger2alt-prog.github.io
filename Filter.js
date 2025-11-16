class ProfanityFilter {
  constructor(runtime) {
    this.runtime = runtime;
  }

  getInfo() {
    return {
      id: 'profanityFilter',
      name: 'Profanity Filter',
      blocks: [
        {
          opcode: 'censorText',
          blockType: Scratch.BlockType.REPORTER,
          text: 'censor [message]',
          arguments: {
            message: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hello world'
            }
          }
        },
        {
          opcode: 'containsProfanity',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'contains profanity [message]',
          arguments: {
            message: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hello'
            }
          }
        }
      ]
    };
  }

  // Calls PurgoMalum to censor the text
  async censorText(args) {
    const msg = args.message;
    const url = 'https://www.purgomalum.com/service/json?text=' + encodeURIComponent(msg);
    try {
      const response = await fetch(url);
      const data = await response.json();
      // PurgoMalum returns: { "result": "cleaned text" } :contentReference[oaicite:0]{index=0}
      return data.result;
    } catch (e) {
      console.error('ProfanityFilter API error', e);
      return msg;
    }
  }

  // Checks if there is any profanity
  async containsProfanity(args) {
    const msg = args.message;
    const url = 'https://www.purgomalum.com/service/containsprofanity?text=' + encodeURIComponent(msg);
    try {
      const response = await fetch(url);
      const text = await response.text();
      return text.trim() === 'true';
    } catch (e) {
      console.error('ProfanityFilter API error', e);
      return false;
    }
  }
}

Scratch.extensions.register(new ProfanityFilter());
