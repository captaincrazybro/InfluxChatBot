const leaderboard = require('../features/Leaderboard');

module.exports = {
    name: 'leaderboard',
    execute(message, args) {
        leaderboard("841715854181138462");
    }
}