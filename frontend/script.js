document.addEventListener('DOMContentLoaded', (event) => {
  init();
});
/**
  Basic state of application
**/
let init = () => {

  todosApi.getAllTodos()
  .then((data) => {
    let todos = JSON.parse(data);
    todos.forEach(todo => makeRow(todo));
  })
  .catch(err => console.log(err));

  document.getElementById('add-todo').addEventListener('click', (event) => {
    const inputValue = document.getElementById('input-field').value;
    if (!inputValue || /^\s+$/.test(inputValue)) {
      alert('New ToDo can not be empty');
      return;
    }

    todosApi.createTodo({content: inputValue})
    .then((id) => {
      todosApi.getTodoById(id.replace(/"/g,""))
      .then((todo) => {
        makeRow(JSON.parse(todo));
        document.getElementById('input-field').value = '';
      });
    })
    .catch((err) => console.error(err));
  });
};
/**
  * add html with one todo
  * @param todo {Object} one todo
**/
const makeRow = (todo) => {
  let listContainer = document.getElementById('todo-list');
  let row = document.createElement('div');
  row.classList.add('todo-single-row');
  let firstColumn = document.createElement('div');
  firstColumn.classList.add('first-column');
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = todo._id;
  checkbox.checked = todo.finished;

  if (todo.finished) {
    row.classList.add('done');
  }

  row.appendChild(firstColumn).appendChild(checkbox);
  let contentBox = document.createElement('div');
  contentBox.classList.add('todo-content');
  let content = document.createTextNode(todo.content);
  row.appendChild(contentBox).appendChild(content);

  let binBox = document.createElement('div');
  binBox.classList.add('todo-bin');
  let bin = document.createElement('img');
  bin.src = '../assets/trash.png';
  row.appendChild(binBox).appendChild(bin);

  listContainer.appendChild(row);

// Delete todo
  bin.addEventListener('click', (event) => {
    todosApi.deleteTodo(todo._id)
    .then(row.remove())
    .catch(err => console.log(err));
  });
// Check / uncheck todo
  checkbox.addEventListener('change', (event) => {
    updateFinishedTodo(
      checkbox.id,
      checkbox.checked
    );
    if (checkbox.checked) {
      row.classList.add('done');
    } else {
      row.classList.remove('done');
    }
  });
};

/**
  *
  * @param id {string} id of todo note
  * @param finished {string} state of todo note
**/
const updateFinishedTodo = (id, finished) => {
 var todo = {
   finished
 };
 todosApi.updateTodo(id, todo);
};

/**
  Object for communication with API
**/

const todosApi = {
  url: 'http://salty-plains-72179.herokuapp.com/todos',

  /**
    * This function makes request to API
    * @param method
    * @param url
    * @param payload
    * @return {Promise} with api response
  **/
  makeRequest: (method, url, payload) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        }
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };

      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };

      xhr.send(payload);
    });
  },
/**
  * get all todo notes 
  * @return {Promise} with list of all todos
**/
  getAllTodos: () => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('GET', todosApi.url)
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },
  /**
    * get one todo note by id
    * @param id {string} - id of todo note
    * @return {Promise} with one todo note
  **/
  getTodoById: (id) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('GET', `${todosApi.url}\\${id}`)
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },
  /**
    * create todo note
    * @param todo {string} content of todo note
    * @return {Promise} with id of todo note
  **/
  createTodo: (todo) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('POST', todosApi.url, JSON.stringify(todo))
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },
  /**
    * updates todo note
    * @param id {string} of todo note
    * @param todo {Object} with data to update
    * @return {Promise} with updated version of item
  **/
  updateTodo: (id, todo) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('PATCH',`${todosApi.url}\\${id}` , JSON.stringify(todo))
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },
  /**
    * deletes todo note
    * @param id {string} - id of todo note
    * @return {Promise} with deleted todo note
  **/
  deleteTodo: (id) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('DELETE',`${todosApi.url}\\${id}`)
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  }
};
