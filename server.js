// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form and JSON data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
var todos = [
  { _id: 1, task: 'Laundry', description: 'Wash clothes' },
  { _id: 2, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
  { _id: 3, task: 'Homework', description: 'Make this app super awesome!' }
];

var newTodo = {
  _id: 0,
  task: '',
  description: '',
};

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 *
 * The comments below give you an idea of the expected functionality
 * that you need to build. These are basic descriptions, for more
 * specifications, see the todosTest.js file and the outputs of running
 * the tests to see the exact details. BUILD THE FUNCTIONALITY IN THE
 * ORDER THAT THE TESTS DICTATE.
 */

app.get('/api/todos/search', function search(req, res) {
  /* This endpoint responds with the search results from the
   * query in the request. COMPLETE THIS ENDPOINT LAST.
   */
  console.log(req.query.q);
  var results = [];
  for (var m = 0; m < todos.length; m++) {
    console.log(todos[m].task.search(req.query.q));
    console.log(todos[m].description.search(req.query.q));
    if (todos[m].task.search(req.query.q) >= 0 || todos[m].description.search(req.query.q) >= 0) {
      results.push(todos[m]);
    }
  }
  res.json(results);
});

app.get('/api/todos', function index(req, res) {
  res.json({todos: todos});
});

app.post('/api/todos', function create(req, res) {
  newTodo._id = todos.length + 1;
  newTodo.task = req.body.task;
  newTodo.description = req.body.description;
  todos.push(newTodo);
  res.json(newTodo);
});

app.get('/api/todos/:id', function show(req, res) {
  var id = req.params.id;
  //console.log('id: ' + id);
  for (var i = 0; i < todos.length; i++) {
    //console.log('i; ' + i);
    if (todos[i]._id == id) {
      res.send(todos[i]);
      break;
    }
  }
  res.send('ERROR::not found');
});

app.put('/api/todos/:id', function update(req, res) {
 console.log(req.body);
  for (var k = 0; k < todos.length; k++) {
    if (todos[k]._id == req.params.id) {
      if (req.body.task) {
        todos[k].task = req.body.task;
      }
      if (req.body.description) {
        todos[k].description = req.body.description;
      }
      res.json(todos[k]);
    }
  }
  res.send('ERROR::' + req.params.id + ' not found');
});

app.delete('/api/todos/:id', function destroy(req, res) {
  for (var j = 0; j < todos.length; j++) {
    if (todos[j]._id == req.params.id) {
      // save a copy of the deleted todo
      // newTodo._id = todos[j]._id;
      // newTodo.task = todos[j].task;
      // newTodo.description = todos[j].description;

      // todos[j]._id= -1;
      // todos[j].task = '';
      // todos[j].description = '';
      //res.json(newTodo);
      res.json(todos[j]);
      todos.splice(j, 1);

      //res.json(newTodo);
    }
  }
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});
