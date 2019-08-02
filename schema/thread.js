  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var threadSchema = new Schema({
    board_id: String,
    text: String,
    delete_password: String,
    reported: Boolean,
    created_on: Date,
    bumped_on: Date,
    replies: [],
    replycount: Number
  });

  var Thread = mongoose.model('thread', threadSchema);
  module.exports = Thread;