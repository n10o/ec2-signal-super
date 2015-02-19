var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Content: start or stop
var Schema = new Schema({
    id: String,
    facebookId: String,
    instanceId: String,
    content: String,
    time: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Execlog', Schema);
