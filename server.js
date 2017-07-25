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
  { _id: 3, task: 'Homework', description: 'Make this app super awesome!' },
  { _id: 4, task: 'Cats', description: 'Get more dry food'},
  { _id: 5, task: 'Cats 2.0', description: 'Wash the cat beds'}
];

// search results
var results = [];

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/search', function searchpage(req, res) {
  res.sendFile(__dirname + '/views/search.html');
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
 //console.log(req.query.q);
  var re = new RegExp(req.query.q, 'i');
  console.log(re);
  for (var m = 0; m < todos.length; m++) {
    //console.log(todos[m].task.search(req.query.q));
    //console.log(todos[m].description.search(req.query.q));
    //if (todos[m].task.search(re) >= 0 || todos[m].description.search(re) >= 0) {
    if (todos[m].task.search(re) >= 0) {
      results.push(todos[m]);
    }
  }
  res.json({todos: results});
});

app.get('/api/todos', function index(req, res) {
  res.json({todos: todos});
});

app.post('/api/todos', function create(req, res) {
  todos.push({ 
    _id: todos[todos.length - 1]._id + 1, 
    task: req.body.task, 
    description: req.body.description
  });
  res.json(todos[todos.length - 1]);
});

app.get('/api/todos/:id', function show(req, res) {
  var id = req.params.id;
  for (var i = 0; i < todos.length; i++) {
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
      res.json(todos[j]);
      todos.splice(j, 1);
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
