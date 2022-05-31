class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindAddTodo(this.addTodo.bind(this));
    this.view.bindRetrieveAll(this.retrieveAll.bind(this));
    this.view.bindUpdateTodo(this.updateTodo.bind(this));
    this.view.bindDeleteTodo(this.deleteTodo.bind(this));
    this.view.bindUpdateCompleteStatus(this.updateCompleteStatus.bind(this));
    this.initialRetrieveAll();
  }

  async initialRetrieveAll() {
    const allTodos = await this.model.retrieveAll();
    // console.log(allTodos)
    this.view.allTodos = allTodos;
    this.view.initialLoad(allTodos);
  }

  async addTodo(todo) {
    await this.model.addTodo(todo)
      .then(() => {
        this.retrieveAll();
      }).catch((err) => {
        console.log(err);
      });
    this.retrieveAll();
  }

  async retrieveAll() {
    const allTodos = await this.model.retrieveAll();
    this.view.allTodos = allTodos;
    this.view.updateAllTodos();
  }

  async updateTodo(id, todo) {
    await this.model.updateTodo(id, todo)
      .then(() => {
        this.retrieveAll();
      }).catch((err) => {
        console.log(err);
      });
    this.retrieveAll();
  }

  async deleteTodo(id) {
    await this.model.deleteTodo(id)
      .then(() => {
        this.retrieveAll();
      }).catch((err) => {
        console.log(err);
      });
  }

  async updateCompleteStatus(id, keyValue) {
    await this.model.updateCompleteStatus(id, keyValue)
      .then(() => {
      }).catch((err) => {
        console.log(err);
      });
    this.retrieveAll();
  }
}

export default Controller;
