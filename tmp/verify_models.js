const Pet = require('../models/Pet');
const MoodLog = require('../models/MoodLog');
const Task = require('../models/Task');
const UserTask = require('../models/UserTask');

console.log('All models imported successfully!');
console.log('Pet model:', Pet.modelName);
console.log('MoodLog model:', MoodLog.modelName);
console.log('Task model:', Task.modelName);
console.log('UserTask model:', UserTask.modelName);
