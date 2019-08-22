const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return {
      key: 'message',
    };
  }

  async run(message) {
    if (!message) return;
    if (!message.channel) return;
    if (!message.author) return;
    const {
      ignoreCase,
      prefix,
      splitArgs,
      ignoreBots,
      ignoreSelf,
      spaceAfterPrefix,
    } = this.client.config.guild.get(message.guild ? message.guild.id : null);
    if (ignoreBots && message.author.bot) return;
    if (ignoreSelf && message.author.id === this.client.user.id) return;
    let { content } = message;
    if (ignoreCase) content = content.toLowerCase();
    let prefixes = prefix;
    let matched = null;
    if (!(prefixes instanceof Array)) prefixes = [prefixes];
    for (const _prefix of prefixes) {
      if (matched) break;
      if (typeof _prefix === 'string' && content.startsWith(_prefix)) {
        matched = prefix;
      } else if (_prefix instanceof RegExp) {
        let __prefix = _prefix;
        if (!_prefix.source.startsWith('^')) {
          __prefix = new RegExp(`^${_prefix.source}`, _prefix.flags);
        }
        matched = content.match(__prefix);
        if (matched) matched = matched[0];
      }
    }
    if (!matched) return;
    if (typeof matched === 'string' && !content.startsWith(matched)) return;
    if (matched instanceof Array) matched = matched[0];
    let args = message.content.slice(matched.length);
    if (splitArgs) args = args.split(splitArgs);
    let cmd = args.shift();
    if (!cmd && spaceAfterPrefix && args[0]) {
      cmd = args.shift();
    }
    if (ignoreCase) cmd = cmd.toLowerCase();
    const filter = e => e.key === cmd || e.aliases.includes(cmd);
    const command = this.client.commands.find(filter);
    if (!command) return;
    const permTest = await this.client.permLevels.test(
      command.permLevel,
      message,
      this.client
    );
    if (!permTest) return command.noPermsRun(message, args);
    if (command.cooldowns.get(message.author.id) > Date.now()) return;
    command.cooldowns.set(message.author.id, Date.now() + command.cooldown);
    command._run(message, args);
  }
};
