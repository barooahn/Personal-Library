/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  const project = 'books';

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
            collection.find().toArray(function(err, docs) {
              const booksRes = []
              docs.map(x => {
                const commentcount = x.comments.length;  
                  booksRes.push({title: x.title, _id: x._id, commentcount: commentcount});
              });
              console.log(booksRes);
              {res.json(booksRes)}
            });
          db.close();
        });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        const collection = db.collection(project);
          collection.insertOne({title: title, comments:[]},function(err,doc){
            const newBook_id = doc.insertedId;
          
            res.json({title: title, _id: newBook_id});
          });
        db.close();
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        const collection = db.collection(project);
        collection.remove(),
          function(err,doc){
            (!err) ? res.send('delete successful') : res.send('could not delete ' + req.body._id + err);
          }  
      });
       
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
          collection.findAndRemove(
            {_id:new ObjectId(req.body._id)},
            [['_id',1]],
            function(err,doc){
              (!err) ? res.send('delete successful') : res.send('could not delete ' + req.body._id + err);
            }  
          );
      });
    });
  
};
