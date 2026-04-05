const userStats = require('./userStats');
const moodStats = require('./moodStats');
const petStats = require('./petStats');
const taskStats = require('./taskStats');

module.exports = {
    ...userStats,
    ...moodStats,
    ...petStats,
    ...taskStats
};
