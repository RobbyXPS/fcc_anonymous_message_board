/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

let expect = require('chai').expect;
let BoardHandler = require('../controllers/boardHandler')
let ThreadHandler = require('../controllers/threadHandler')
let ReplyHandler = require('../controllers/replyHandler')


module.exports = function (app) {
  
  let boardHandler = new BoardHandler();
  let threadHandler = new ThreadHandler();
  let replyHandler = new ReplyHandler();
  
  
  
  app.route('/api/threads/:board')
    .get(threadHandler.threadList)
    .post(threadHandler.newThread)
    .put(threadHandler.reportThread)
    .delete(threadHandler.deleteThread)
  
  app.route('/api/replies/:board')
    .post(replyHandler.newReply)
    .get(replyHandler.replyList)
    .put(replyHandler.reportReply)
    .delete(replyHandler.deleteReply)
  
  app.route('/api/boards')
    .get(boardHandler.boardList)
};