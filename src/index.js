const Discord = require('discord.js');

module.exports = {
  Core: require('./structures/Core'),
  Store: require('./structures/Store'),
  Event: require('./structures/Event'),
  Command: require('./structures/Command'),
  Monitor: require('./structures/Monitor'),
  Trigger: require('./structures/Trigger'),
  Inhibitor: require('./structures/Inhibitor'),
  Mongo: require('./structures/Mongo'),
  MySql: require('./structures/MySql'),
  Pages: require('./structures/Pages'),
  UniqueId: require('./util/UniqueId'),
  Collection: require('./util/Collection'),
  PermissionLevels: require('./structures/PermissionLevels'),
  Embed: Discord.RichEmbed,
  Discord,
};
