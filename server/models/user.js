var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: String,
    name: String,
    facebookId: String
});

module.exports = mongoose.model('User', UserSchema);