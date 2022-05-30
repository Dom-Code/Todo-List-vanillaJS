/* eslint-disable class-methods-use-this */
class Model {
  retrieveAll() {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', '/api/todos');
      request.responseType = 'json';
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          console.log('Todos loaded successfully');
          resolve(request.response);
        } else {
          console.log('Todos did not load.');
          reject(request.error);
        }
      });
      request.send();
    });
  }

  addTodo(data) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', '/api/todos');
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          console.log('Todo was added successfully.');
          resolve(request.response);
        } else {
          console.log('Todo was not added.');
          reject(new Error({
            status: request.status,
            statusText: request.statusText,
          }));
        }
      });
      request.send(data);
    });
  }

  deleteTodo(id) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('DELETE', `/api/todos/${id}`);
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          console.log('Todo was deleted');
          resolve();
        } else {
          reject(new Error({
            status: request.status,
            statusText: request.statusText,
          }));
          console.log('Todo was not deleted');
        }
      });
      request.send(null);
    });
  }

  updateTodo(id, todo) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('PUT', `/api/todos/${id}`);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          console.log('Todo was updated');
          resolve(request.response);
        } else {
          console.log('Todo was not updated');
          reject(new Error({
            status: request.status,
            statusText: request.statusText,
          }));
        }
      });
      request.send(todo);
    });
  }

  updateCompleteStatus(id, keyValue) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('PUT', `/api/todos/${id}`);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          console.log('Complete status was updated');
          resolve(request.response);
        } else {
          console.log('Complete status was not updated');
          reject(new Error({
            status: request.status,
            statusText: request.statusText,
          }));
        }
      });
      request.send(keyValue);
    });
  }
}

export default Model;
