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
              //console.log(docs);
              if(docs){
                if(docs.length>0){
                  const booksRes = [];
                  docs.map(x => {
                    const commentcount = x.comments.length;  
                      booksRes.push({title: x.title, _id: x._id, commentcount: commentcount});
                  });
                  //console.log(booksRes);
                  {res.json(booksRes)};
                }
              } else {
                res.send('no books yet');
              }
            });
          db.close();
        });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!req.body.title) {res.send('missing title')}
      else{
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
            collection.insertOne({title: title, comments:[]},function(err,doc){
              //doc._id = doc.insertedId;
              res.json(doc.ops[0]);
            });
          db.close();
        });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        const collection = db.collection(project);
        collection.remove();
        res.send("complete delete successful");
        db.close();
      });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      if(!ObjectId.isValid(req.params.id)){res.send('no book exists')}
      const bookid = new ObjectId(req.params.id);
      //console.log("id", bookid);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
            collection.findOne({_id: bookid},function(err, doc) {
              //res.json({_id: doc._id, title: doc.title, comments: doc.comments})
              
              if(err){res.send('no book exists' + err)}
              else if(doc === null) {res.send('no book exists')}
              else{ res.json(doc)};           
            });
          db.close();
        });
    
    
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        const collection = db.collection(project);
        collection.findAndModify(
          {_id:new ObjectId(req.params.id)},
          [['_id',1]],
          {$push: {comments: comment}},
          {new: true},
          function(err,doc){
            (!err) ? res.json(doc.value) : res.send('could not add comment '+ req.params.id +' '+ err);
          }  
        );
        db.close();
      });
      
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          const collection = db.collection(project);
          collection.findAndRemove(
            {_id:new ObjectId(req.body._id)},
            [['_id',1]],
            function(err,writeResult){
              //console.log('writeResult', writeResult);
              (!err) ? res.send('delete successful') : res.send('no book exists');
            }  
          );
        db.close();
      });
    });
  
};
