let Thread = require('../schema/thread')
const mongoose = require('mongoose')

function ThreadHandler() {
  
  this.threadList = function(req, res) {
    // obtain the board_name from the Front-End
    let board_name = req.params.board ;
    // argument #1: query filter (aka conditions)
    // argument #2: query projection (include (1) or exclude (0) from the query)
    // argument #3: general query options (sort threads for last created first (-1))
    // get all the threads for the board, make sure to exclued the sensitive info we don't want to expose to the user (reported/delete_password)
    // also sort the threads so the latest one created is on top and that only the last 10 are returned to the user
    Thread.find({ board_id: board_name },{ reported: 0, delete_password: 0 }).sort({ bumped_on: -1 }).limit(10).exec(function (err, docs) {
      // update replycount so the Front-End can use it to display text
      docs.forEach(function(doc) {
          doc.replycount = doc.replies.length;
          // only display the last 3 replys for the thread
          if(doc.replies.length > 3) {
            doc.replies = doc.replies.slice(-3);
          };
        });
      res.json(docs);
    });
  };

  this.newThread = function(req, res) {
    // obtain the board_name/thread_text/thread_password from the Front-End
    let board_name = req.params.board;
    let thread_text = req.body.text;
    let thread_password = req.body.delete_password;
    // construct thread object with user supplied info
    let thread = new Thread({
      board_id: board_name,
      text: thread_text,
      delete_password: thread_password,
      reported: false,
      created_on: new Date(),
      bumped_on: new Date(),
      replies: []
    });
    // save object to the db
    thread.save(function(err) {
      if (err) return err;
    });
    // redirect the user to the same page so it shows their new thread
    res.redirect('/b/'+board_name);
  };

  this.reportThread = function(req, res) {
    // obtain the thread_id from the Front-End
    let thread_id = req.body.report_id;
    // find the thread in the db and set it's reported value to true
    Thread.findOneAndUpdate({ _id: thread_id }, { $set: { reported: true } }, function(err,doc) {
      // send back text that will display in alert message to user
      res.send('reported');
    });
  };
  
  this.deleteThread = function(req, res) {
    // obtain the thread_id/reply_id/delete_password from the Front-End
    let thread_id = req.body.thread_id;
    let reply_id = req.body.reply_id;
    let delete_password = req.body.delete_password;

    // find the thread in the db
    Thread.find({ _id: thread_id },function(err, doc) {})
      .then((doc) => {
      // if the user supplied the correct password delete the thread, otherwise let them know it's not the correct one
      if (doc[0].delete_password == delete_password) {
        // delete the thread from the db
        Thread.deleteOne({ _id: thread_id }, function (err) {
          if (err) return err;
          // send back text that will display in alert message to user
          res.send('success');
        });
      }
      else {
        // send back text that will display in alert message to user
        res.send('incorrect password')
      };
    });
  };
};

module.exports = ThreadHandler;