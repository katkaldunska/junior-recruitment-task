document.addEventListener('DOMContentLoaded', (event) => {
  init();
});

let init = () => {
  const listContainer = document.getElementById('list-container');
  todosApi.getAllTodos()
  .then((data) => {
    let todos = JSON.parse(data);
    todos.forEach(todo => listContainer.appendChild(makeRow(todo)));

  })
  .catch(err => console.log(err));
  // todosApi.getTodoById('5bb52891f2b63300157e8e7e')
  // todosApi.createTodo({content: 'test'})
  // todosApi.updateTodo({
  //   _id: '5bb52891f2b63300157e8e7e',
  //   finished: true
  // })
  // todosApi.deleteTodo('5bb60aba87c69400154161e6')

};

let makeRow = (todo) => {
  let row = document.createElement('div');
  row.classList.add('todo-single-row');
  let firstColumn = document.createElement('div');
  firstColumn.classList.add('first-column');
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = todo._id;
  checkbox.checked = todo.finished;

  checkbox.addEventListener('change', (event) => updateFinishedTodo(
    checkbox.id,
    checkbox.checked
  ));

  row.appendChild(firstColumn).appendChild(checkbox);
  let contentBox = document.createElement('div');
  contentBox.classList.add('todo-content');
  let content = document.createTextNode(todo.content);
  row.appendChild(contentBox).appendChild(content);
  return row;
};

const updateFinishedTodo = (id, finished) => {
 var todo = {
   finished: finished
 };
 todosApi.updateTodo(id, todo)
};

const todosApi = {
  url: 'http://salty-plains-72179.herokuapp.com/todos',

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

  getAllTodos: () => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('GET', todosApi.url)
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },

  getTodoById: (id) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('GET', `${todosApi.url}\\${id}`)
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },

  createTodo: (todo) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('POST', todosApi.url, JSON.stringify(todo))
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },

  updateTodo: (id, todo) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('PATCH',`${todosApi.url}\\${id}` , JSON.stringify(todo))
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  },

  deleteTodo: (id) => {
    return new Promise((resolve, reject) => {
      todosApi.makeRequest('DELETE',`${todosApi.url}\\${id}`)
      .then((data) =>  resolve(data))
      .catch((err) => reject(err));
    });
  }
};
