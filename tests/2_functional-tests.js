/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({
              issue_title: 'testing title',
              issue_text: 'testing text',
              created_by: 'Functional Test - Every field filled in',
              assigned_to: 'fcctester',
              status_text: 'In QA_update'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.property(res.body, 'issue_title');
              assert.property(res.body, 'issue_text');
              assert.property(res.body, 'created_on');
              assert.property(res.body, 'updated_on');
              assert.property(res.body, 'created_by');
              assert.property(res.body, 'assigned_to');
              assert.property(res.body, 'open');
              assert.property(res.body, 'status_text');
              assert.property(res.body, '_id');
              _ida = res.body._id;
              assert.equal(res.body.issue_title, 'testing title');
              assert.equal(res.body.issue_text, 'testing text');
              assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
              assert.equal(res.body.assigned_to, 'fcctester');
              assert.equal(res.body.status_text, 'In QA_update');
              assert.isBoolean(res.body.open);
              assert.equal(res.body.open, true);
              done();
            });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        //done();
      });
      
    });

  });

});
