// wait for DOM to load before running JS
$(document).ready(function() {

  // base API route
  var baseUrl = '/api/todos';

  // array to hold todo data from API
  var allTodos = [];

  // element to display list of todos
  var $todosList = $('#todos-list');

  // form to create new todo
  var $createTodo = $('#create-todo');

  // compile handlebars template
  var source = $('#todos-template').html();
  var template = Handlebars.compile(source);

  // // form to search todos
  // var $searchTodo = $('#search-todo');

  // // search results
  // var results = [];

  // // element to display list of search results
  // var $resultsList = $('#search-list');

  // // and now do the search version of the template
  // var searchSource = $('#search-template').html();
  // var searchTemplate = Handlebars.compile(searchSource);

  // helper function to render all todos to view
  // note: we empty and re-render the collection each time our todo data changes
  function render() {
    // empty existing todos from view
    $todosList.empty();

    // pass `allTodos` into the template function
    var todosHtml = template({ todos: allTodos });

    // append html to the view
    $todosList.append(todosHtml);
  }

  // // search version of the render() helper function
  // function renderResults() {
  //   // empty existing todos from view
  //   $resultsList.empty();

  //   // pass 'results' into the template function
  //   var resultsHtml = searchTemplate({ todos: results });

  //   // append html to the view
  //   $resultsList.append(resultsHtml);
  // }

  // GET all todos on page load
  $.ajax({
    method: "GET",
    url: baseUrl,
    success: function onIndexSuccess(json) {
      //console.log(json);

      // set `allTodos` to todo data (json.data) from API
      allTodos = json.todos;

      // render all todos to view
      render();
    }
  });

  // // listen for submit event on form
  // $searchTodo.on('submit', function (event) {
  //   event.preventDefault();
  //   //console.log(event);

  //   // serialze form data
  //   var newTodoSearch = $(this).serialize();
  //   //console.log($(this));
  //   //console.log(newTodoSearch);

  //   // Get request to create new todo
  //   console.log(baseUrl + '/search?' + newTodoSearch);
  //   $.ajax({
  //     method: "GET",
  //     url: baseUrl + '/search?' + newTodoSearch,
  //     success: function onSearchSuccess(json) {
  //       console.log(json);

  //       // place all search results in results
  //       results = json.todos;

  //       // render all todos to view
  //       renderResults();
  //     }
  //   });

  //   // reset the form
  //   $searchTodo[0].reset();
  //   $searchTodo.find('input').first().focus();
  // });

  // listen for submit event on form
  $createTodo.on('submit', function (event) {
    event.preventDefault();

    // serialze form data
    var newTodo = $(this).serialize();

    // POST request to create new todo
    $.ajax({
      method: "POST",
      url: baseUrl,
      data: newTodo,
      success: function onCreateSuccess(json) {
        console.log(json);

        // add new todo to `allTodos`
        allTodos.push(json);

        // render all todos to view
        render();
      }
    });

    // reset the form
    $createTodo[0].reset();
    $createTodo.find('input').first().focus();
  });

  // add event-handlers to todos for updating/deleting
  $todosList

    // for update: submit event on `.update-todo` form
    .on('submit', '.update-todo', function (event) {
      event.preventDefault();

      // find the todo's id (stored in HTML as `data-id`)
      var todoId = $(this).closest('.todo').attr('data-id');

      // find the todo to update by its id
      var todoToUpdate = allTodos.filter(function (todo) {
        return todo._id == todoId;
      })[0];

      // serialze form data
      var updatedTodo = $(this).serialize();

      // PUT request to update todo
      $.ajax({
        type: 'PUT',
        url: baseUrl + '/' + todoId,
        data: updatedTodo,
        success: function onUpdateSuccess(json) {
          // replace todo to update with newly updated version (json)
          allTodos.splice(allTodos.indexOf(todoToUpdate), 1, json);

          // render all todos to view
          render();
        }
      });
    })

    // for delete: click event on `.delete-todo` button
    .on('click', '.delete-todo', function (event) {
      event.preventDefault();

      // find the todo's id (stored in HTML as `data-id`)
      var todoId = $(this).closest('.todo').attr('data-id');

      // find the todo to delete by its id
      var todoToDelete = allTodos.filter(function (todo) {
        return todo._id == todoId;
      })[0];

      // DELETE request to delete todo
      $.ajax({
        type: 'DELETE',
        url: baseUrl + '/' + todoId,
        success: function onDeleteSuccess(json) {
          // remove deleted todo from all todos
          allTodos.splice(allTodos.indexOf(todoToDelete), 1);

          // render all todos to view
          render();
        }
      });
    });

});



