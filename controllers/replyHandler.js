let Thread = require('../schema/thread');
const mongoose = require('mongoose')


function ReplyHandler() {

  this.replyList = function(req, res) {
    // obtain the thread_id from the user
    let thread_id = req.query.thread_id;
    // find the thread document making sure to exclued the sensitive info we don't want to expose to the user (reported/delete_password)
    Thread.find({ _id: thread_id },{ reported: 0, delete_password: 0 }, function(err, doc) {
      // from the replies as well, exclued the sensitive info we don't want to expose to the user (reported/delete_password)
      doc[0].replies.forEach(function(item) {
        delete item.reported
        delete item.delete_password
      });
      // thread docs are arrays, make sure to send back the object and not the array via [0]
      res.json(doc[0])
    });
  };
  
  this.newReply = function (req, res) {
    // obtain the thread_id/text/password from the user
    let text = req.body.text;
    let password = req.body.delete_password;
    let thread_id = req.body.thread_id;
    // construct a reply object with the user info so we can add it to the thread
    let reply = {
      _id: mongoose.Types.ObjectId(),
      text: text,
      delete_password: password,
      created_on: new Date(),
      reported: false 
    };
    // find the thread in the db
    Thread.findOne({ _id: thread_id }, function(err, doc) {
      // update the threads bumped value to correlate to the time the reply was created
      doc.bumped_on = reply.created_on;
      // add the reply to the thread
      doc.replies.push(reply);
      doc.save();
      // redirect the user from the board page to the thread page when they add a reply
      res.redirect('/b/'+doc.board_id+'/'+doc._id);  
    });
  };
  
  this.reportReply = function(req, res) {
    // obtain the thread_id/reply_id from the user
    let thread_id = req.body.thread_id;
    let reply_id = req.body.reply_id;
    // find the thread in the db
    Thread.findOne({ _id: thread_id }, function (err, doc) {
      // find where the reply exists in the array of replies from it's id
      let reply_index = doc.replies.findIndex(current_reply => current_reply._id == reply_id);
      // update the reply so that it is reported
      doc.replies[reply_index].reported = true;
      // let the db know the sub-document array was updated
      doc.markModified('replies');
      doc.save();
      // send back text that will display in alert message to user
      res.send('reported');
    });
  };
  
  this.deleteReply = function(req, res) {
    // obtain the thread_id/reply_id/delete_password from the user
    let thread_id = req.body.thread_id;
    let reply_id = req.body.reply_id;
    let supplied_password = req.body.delete_password;
    
    // find the thread in the db
    Thread.find({ _id: thread_id},function(err, doc) {})
      // pass the thread to the callback so you can update the reply in it's array
      .then((doc) => {
      // find where the reply exists in the array of replies from it's id to get it's delete password value
      let reply_index = doc[0].replies.findIndex(current_reply => current_reply._id == reply_id);
      let reply_password = doc[0].replies[reply_index].delete_password;
      // if the user supplied the correct password delete the reply, otherwise let them know it's not the correct one
      if (reply_password == supplied_password) {
        // convert the string value provided by the Front-End to a mongoose ObjectID so it can look it up correctly in the db
        var reply_converted_id = mongoose.Types.ObjectId(reply_id);
        // obscure the reply text by updating it to '[deleted]'
        Thread.updateOne({ _id: thread_id, 'replies._id' : reply_converted_id },
                         {'$set': {'replies.$.text': '[deleted]'}},
                         { 'new': true }, 
                         function (err, doc) { res.send('success') });
      } 
      else {
        res.send('incorrect password');
      };
    });
  };
};

module.exports = ReplyHandler;