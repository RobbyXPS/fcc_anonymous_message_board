let Thread = require('../schema/thread');
const mongoose = require('mongoose');

function BoardHandler() {
  this.boardList = function(req, res) {
  
    // helper function to look up if boards already exist in response obj instead of db, had issues with chaining mongoose promises
    function compairBoardNames(arr, comp_name) {
      for(var i = 0; i < arr.length; i++) {
        if (arr[i].name == comp_name) {
          return i;
          break;
        }
      }
      return -1
    }
      
  // look up all the boards in the db so we can display them to the user
  Thread.find({}, function(err, threads) {
    // instantiate our return obj
    var board_info = []
    // loop through each doc in the db and gather it's info
    threads.forEach(function(thread) {
      // get index in return obj if current doc has already been acocunted for
      var thread_index = compairBoardNames(board_info, thread.board_id);
      
      // if thread_index is greater then one we already logged it and just need to update the current obj in the array
      if (thread_index >= 0) {
        // incriment the threads and replies associated with the current board_id
        board_info[thread_index]['threads'] += 1
        board_info[thread_index]['replies'] += thread.replies.length
      } 
      // if thread_index is less than one we need to add the obj to the array
      else {
        board_info.push(
          {
            name: thread.board_id,
            threads: 1,
            replies: thread.replies.length
          })
      }
    });
    // send back the response obj
    res.send(board_info)
  });
  }
}
  
module.exports = BoardHandler;