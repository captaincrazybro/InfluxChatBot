const leaderboard = require('../features/Leaderboard');

module.exports = {
    name: 'leaderboard',
    aliases: ["lb", "gtop", "gexptop", "gexplb"],
    execute(message, args, client) {
        leaderboard(message.channel.id, client);
    }
}