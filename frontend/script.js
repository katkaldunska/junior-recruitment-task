document.addEventListener('DOMContentLoaded', (event) => {
  init();
});

let init = () => {
  console.log('test');
  makeRequest('GET', 'https://salty-plains-72179.herokuapp.com/todos', (err, datums) => {
    if (err) {throw err;}
    console.log(datums);
  })
}


let todosApi = {
  url: 'http://salty-plains-72179.herokuapp.com/todos',
  getAllTodos: () => {

  }
}

let makeRequest = (method, url, callback) => {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url);
  // xhr.setRequestHeader('Access-Control-Allow-Origin', true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    callback(null, xhr.response);
  };
  xhr.onerror = function () {
    callback(xhr.response);
  };
  xhr.send();
}
