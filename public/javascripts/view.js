/* eslint-disable class-methods-use-this, no-restricted-syntax */
class View {
  constructor() {
    this.allTodos = null;
    this.modal = document.querySelector('#modal');
    this.fieldset = document.querySelector('fieldset');
    this.todosContainer = document.querySelector('#main-container');
    this.navAll = document.querySelector('#all-todos-title');
    this.navComplete = document.querySelector('#complete-todos-title');
    this.title = document.querySelector('#list-title');
    this.count = document.querySelector('.list-count');
    this.modalLayer = document.querySelector('#modal-layer');
    this.submitSave = document.querySelector('#save');
    this.editSave = document.querySelector('#edit-save');
    this.editTodoId = null;
    this.navAllContainer = document.querySelector('#nav-all-container');
    this.navCompleteContainer = document.querySelector('#nav-complete-container');
    this.form = document.querySelector('form');
    this.currentLocation = 'all';
    this.completeSelection = false;
    this.regex = /\d\d \/ \d\d/;
    this.fillModalDates();
  }

  bindRetrieveAll(func) {
    this.retrieveAll = func;
  }

  bindAddTodo(func) {
    this.addTodo = func;
  }

  bindDeleteTodo(func) {
    this.deleteTodo = func;
  }

  bindUpdateTodo(func) {
    this.updateTodo = func;
  }

  bindUpdateCompleteStatus(func) {
    this.sendCompleteStatus = func;
  }

  fillModalDates() {
    const months = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December',
    };
    const daySelect = document.querySelector('#day-select');
    const monthSelect = document.querySelector('#month-select');
    const yearSelect = document.querySelector('#year-select');

    for (let day = 1; day <= 31; day += 1) {
      const dayOption = document.createElement('option');
      if (day < 10) {
        dayOption.value = `0${day}`;
      } else {
        dayOption.value = day;
      }
      dayOption.textContent = day;
      daySelect.appendChild(dayOption);
    }

    for (const [key, value] of Object.entries(months)) {
      const monthOption = document.createElement('option');
      if (key < 10) {
        monthOption.value = `0${key}`;
      } else {
        monthOption.value = key;
      }
      monthOption.textContent = value;
      monthSelect.appendChild(monthOption);
    }

    for (let year = 2022; year <= 2030; year += 1) {
      const yearOption = document.createElement('option');
      yearOption.value = year;
      yearOption.textContent = year;
      yearSelect.appendChild(yearOption);
    }
  }

  /*
  fillModalDates handles the date selection in the add new todo modal.
  */

  initialLoad(todos) {
    this.updateAllTodos();
    this.updateTitleCount('All Todos', todos.length);
    this.enableButtons();
  }

  updateTitleCount(title, count) {
    this.title.textContent = title;
    this.count.textContent = count;
  }

  updateAllTodos() {
    let currentTodos;
    let title;
    if (this.currentLocation && this.currentLocation.month) {
      if (this.completeSelection) {
        title = `${this.currentLocation.month}/${this.currentLocation.year}`;
        currentTodos = this.getAllCompleted(this.getTodosByDate(this.currentLocation));
      } else {
        title = `${this.currentLocation.month}/${this.currentLocation.year}`;
        currentTodos = this.getTodosByDate(this.currentLocation);
      }
    } else if (this.currentLocation === 'complete') {
      currentTodos = this.getAllCompleted();
      title = 'Completed';
    } else if (this.currentLocation === 'noDate') {
      if (this.completeSelection) {
        title = 'No Due Date';
        currentTodos = this.getAllCompleted(this.getTodosByDate());
      } else {
        title = 'No Due Date';
        currentTodos = this.getTodosByDate();
      }
    } else if (this.currentLocation === 'all') {
      currentTodos = this.allTodos;
      title = 'All Todos';
    } else {
      currentTodos = this.allTodos;
      title = 'All Todos';
    }
    this.createTemplate(currentTodos);
    this.updateMainTitle(title, currentTodos.length);
  }

  /*
  updateAllTodos will update all the todo lists. It will update information
  based on the location set. If no location is set, it will use the
  todos provided by the model.
  */

  createTemplate(todos) {
    todos.sort((a, b) => Number(a.completed) - Number(b.completed));

    const listTemplate = document.querySelector('#list-template').innerHTML;
    const todoPartial = document.querySelector('#todo-partial').innerHTML;
    const template = Handlebars.compile(listTemplate);
    Handlebars.registerHelper('checkIfBlank', (month, year) => {
      if (month && year) {
        return `${month} / ${year.slice(-2)}`;
      }
      return 'No due date';
    });
    Handlebars.registerPartial('item', todoPartial);
    const data = { todo: todos };
    const container = document.querySelector('#main-container');
    container.innerHTML = template(data);
    this.enableEdit();
    this.updateNav();
    this.enableCheckBoxes();
    this.editCompleted();
  }

  updateMainTitle(newTitle, number) {
    const mainTitle = document.querySelector('#list-title');
    const counter = document.querySelector('#list-count');
    mainTitle.innerHTML = newTitle;
    counter.innerHTML = number;
  }

  updateNav() {
    const completeCount = document.querySelector('#complete-count');
    let completeCounter = 0;
    const allCount = document.querySelector('#all-todos-count');
    allCount.textContent = this.allTodos.length;

    this.allTodos.forEach((todo) => {
      if (todo.completed) {
        completeCounter += 1;
      }
    });
    completeCount.textContent = completeCounter;
    this.fillNavLists();
  }

  fillNavLists() {
    this.navAllContainer.innerHTML = '';
    this.navCompleteContainer.innerHTML = '';
    const allDates = {};
    const completed = {};
    const notDue = 'No Due Date';

    this.allTodos.forEach((todo) => {
      const { month } = todo;
      const { year } = todo;
      let name = '';
      if (todo.completed) {
        if (!month || !year) {
          if (!completed[notDue]) {
            completed[notDue] = [todo];
          } else {
            completed[notDue].push(todo);
          }
        } else {
          name = `${month}/${year.slice(-2)}`;
          if (!completed[name]) {
            completed[name] = [todo];
          } else {
            completed[name].push(todo);
          }
        }
      }

      if (!month || !year) {
        if (!allDates[notDue]) {
          allDates[notDue] = [todo];
        } else {
          allDates[notDue].push(todo);
        }
      } else if (!allDates[name]) {
        name = `${month}/${year.slice(-2)}`;
        allDates[name] = [todo];
      } else {
        allDates[name].push(todo);
      }
    });

    for (const [k, v] of Object.entries(allDates)) {
      const tempData = { date: k, count: v.length };
      this.navAllContainer.insertAdjacentHTML('beforeend', this.compiler(tempData));
    }

    for (const [k, v] of Object.entries(completed)) {
      const tempData = { date: k, count: v.length };
      this.navCompleteContainer.insertAdjacentHTML('beforeend', this.compiler(tempData));
    }
  }
  /*
    fillNavList will create the dates in the navigation section on the left.
    We have an object completed and allDates that will hold the date and todos on that date.
  */

  compiler(data) {
    const navHTML = document.querySelector('#nav-all-template').innerHTML;
    const navTemplate = Handlebars.compile(navHTML);
    return navTemplate(data);
  }

  editCompleted() {
    const inputs = document.querySelectorAll('.checkbox');
    [...inputs].forEach((input) => {
      const parent = input.closest('#todo-item');
      if (input.hasAttribute('checked')) {
        parent.classList.add('complete');
      } else {
        parent.classList.remove('complete');
      }
    });

    [...this.navCompleteContainer.children].forEach((element) => {
      element.classList.add('complete');
    });
  }

  enableButtons() {
    this.enableAdd();
    this.enableDelete();
    this.enableSaveButton();
    this.enableEditSaveButton();
    this.switchToCompleted();
    this.switchToAll();
    this.enableMarkDone();
    this.enableClickableDates();
  }

  enableAdd() {
    const addButton = document.querySelector('.add-new');
    addButton.addEventListener('click', (event) => {
      this.resetSelect();
      event.stopPropagation();
      this.switchToSave();
      this.showModal();
    });
  }

  enableDelete() {
    this.todosContainer.addEventListener('click', (event) => {
      if (event.target.closest('.trash-box')) {
        const id = event.target.closest('td').getAttribute('todo-id');
        this.deleteTodo(id);
      }
    });
  }

  enableSaveButton() {
    this.form = document.querySelector('#modal-form');
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.currentLocation = null;
      const keysValues = [];

      for (let i = 0; i < this.form.elements.length; i += 1) {
        const element = this.form.elements[i];
        let key;
        let value;

        if (element.id !== 'save' && element.id !== 'mark-complete' && element.id !== 'edit-save') {
          key = encodeURIComponent(element.name);
          value = encodeURIComponent(element.value);
          keysValues.push(`${key}=${value}`);
        }
      }
      this.addTodo(keysValues.join('&'));
      this.closeModal();
    });
  }

  /*
    enableSaveButton enables the save button.
    When save button is clicked, it will convert our input in to a url encoded format
    and pass to to controller.
  */
  enableEdit() {
    this.listContainer = document.querySelector('#list-container');
    this.listContainer.addEventListener('click', (event) => {
      if (event.target.tagName === 'P') {
        const id = event.target.closest('#todo-item').getAttribute('todo-id');
        this.editTodoId = id;
        const todo = this.getTodo(id);

        const title = document.querySelector('#title-input');
        title.value = todo.title;

        const description = document.querySelector('#description-input');
        description.value = todo.description;
        this.selects = this.form.querySelectorAll('select');
        this.selects.forEach((sel) => {
          const options = sel.children;
          Array.from(options).forEach((op) => {
            if (todo[sel.name] === op.value) {
              op.setAttribute('selected', '');
            }
          });
        });
        this.showModal();
        this.switchToEdit();
      }
    });
  }
  /*
    enableEdit enables the opening of a modal when a todo is clicked.
  */

  // enableEdit allows the user to click on the todo and will open a prefilled modal.

  switchToEdit() {
    this.submitSave.setAttribute('disabled', '');
    this.submitSave.classList.add('hidden');

    this.editSave.removeAttribute('disabled', '');
    this.editSave.classList.remove('hidden');
  }
  // This changes the modal button from save to update.

  switchToSave() {
    this.submitSave.removeAttribute('disabled');
    this.submitSave.classList.remove('hidden');

    this.editSave.setAttribute('disabled', '');
    this.editSave.classList.add('hidden');
  }
  // this changes the modal button from update to save

  enableEditSaveButton() {
    this.form = document.querySelector('#modal-form');
    this.editSave.addEventListener('click', (event) => {
      event.preventDefault();
      const keysValues = [];

      for (let i = 0; i < this.form.elements.length; i += 1) {
        const element = this.form.elements[i];
        let key;
        let value;
        if (!element.checkValidity()) {
          alert('The title needs to be at least 3 characters.');
          return;
        }
        if (element.id !== 'edit-save' && element.id !== 'mark-complete' && element.id !== 'save') {
          key = encodeURIComponent(element.name);
          value = encodeURIComponent(element.value);
          keysValues.push(`${key}=${value}`);
        }
      }

      event.stopImmediatePropagation();
      this.updateTodo(Number(this.editTodoId), keysValues.join('&'));
      this.closeModal();
    });
  }
  /*
  enableEditSaveButtion will enable the edit save button in the edit modal
  It was also send urlencoded data to the controller, which will update the db
*/

  enableCheckBoxes() {
    const todosDatas = document.querySelectorAll('#todo-data');
    todosDatas.forEach((todo) => {
      const input = todo.firstElementChild;
      todo.addEventListener('click', (event) => {
        let dateArray;

        const text = todo.querySelector('p').textContent;

        if (!this.regex.test(text)) {
          if (this.currentLocation !== 'all' && this.currentLocation !== 'complete') {
            this.currentLocation = 'noDate';
          }
        } else {
          dateArray = text.match(this.regex)[0].split('/');
          const dateM = dateArray[0].trim();
          const dateY = dateArray[1].trim();
          const date = { month: dateM, year: dateY };
          if (this.currentLocation !== 'all' && this.currentLocation !== 'complete') {
            this.currentLocation = date;
          }
        }
        this.editTodoId = todo.closest('#todo-item').getAttribute('todo-id');
        if (event.target.tagName !== 'P') {
          if (input.hasAttribute('checked')) {
            input.removeAttribute('checked');
            this.updateCompleteStatus(false);
          } else {
            input.setAttribute('checked', '');
            this.updateCompleteStatus(true);
          }
        }
      });
    });
  }

  /*
  enableCheckBoxes enables the check boxes. Attributes in DOM are updated when check box is toggled.
  boolean values are also sent to updateComplete status to update the database.
  */

  enableMarkDone() {
    const markDone = document.querySelector('#mark-complete');
    markDone.addEventListener('click', (event) => {
      event.preventDefault();
      if (!this.editTodoId) {
        alert('You cannot mark done until you have saved this contact.');
      }
      this.allTodos.forEach((todo) => {
        if (todo.id == this.editTodoId) {
          this.updateCompleteStatus(true);
        }
      });
    });
  }

  /*
  enableMarkDone will enable mark done button in edit modal.
  It will prevent you from marking a task complete until it has been actually created.
  */

  updateCompleteStatus(status) {
    const keyValue = `completed=${status}`;
    this.sendCompleteStatus(this.editTodoId, keyValue);
  }

  /*
  UpdateCompleteStatus takes a status as an argument and will pass it along with the
  the id of the select todo and pass it to the sendCompleteStatus method. This will then get
  passed to the controller and the complete status will be toggled.
  */

  enableClickableDates() {
    const nav = document.querySelector('nav');
    nav.addEventListener('click', (event) => {
      if (event.target.className === 'nav-dates') {
        const listName = event.target.textContent;
        const listCount = event.target.nextElementSibling.textContent;
        if (listName === 'No Due Date') {
          if (event.target.closest('#nav-complete-container')) {
            this.completeSelection = true;
          } else {
            this.completeSelection = false;
          }
          this.currentLocation = 'noDate';
          this.updateAllTodos();
        } else {
          const date = { month: listName.slice(0, 2), year: `20${listName.slice(-2)}` };
          this.currentLocation = date;
          if (event.target.closest('#nav-complete-container')) {
            this.completeSelection = true;
            this.updateAllTodos();
          } else {
            this.completeSelection = false;
            this.updateAllTodos();
          }
        }
        this.updateTitleCount(listName, listCount);
      }
    });
  }

  sendUpdate(completeStatus) {
    const keysValues = [];
    const todo = this.getTodo(this.editTodoId);
    let key;
    let value;
    if (!todo) return;

    for (const [k, v] of Object.entries(todo)) {
      if (k !== 'id') {
        if (k === 'completed') {
          if (completeStatus) {
            key = encodeURIComponent(k);
            value = encodeURIComponent('true');
            keysValues.push(`${key}=${value}`);
          } else {
            key = encodeURIComponent(k);
            value = encodeURIComponent('false');
            keysValues.push(`${key}=${value}`);
          }
        } else {
          key = encodeURIComponent(k);
          value = encodeURIComponent(v);
          keysValues.push(`${key}=${value}`);
        }
      }
    }
    this.updateTodo(this.editTodoId, keysValues.join('&'));
    this.closeModal();
  }

  /*
  sendUpdate takes a complete status as an argument and pass it along with elements of the
  selected todo to the controller to update the DB.
  */

  getTodosByDate(date) {
    return this.allTodos.filter((todo) => {
      if (!date) {
        if (todo.month === '' || todo.year === '') {
          return todo;
        }
      } else {
        let year;
        if (date.year.length === 2) {
          year = `20${date.year}`;
        } else {
          year = date.year;
        }
        if (todo.month === date.month && todo.year === year) {
          return todo;
        }
      }
    });
  }

  getTodo(id) {
    return this.allTodos.filter((todo) => todo.id == id)[0];
  }
  // getTodo will retrieve the todo object and takes an id number as an argument.

  switchToCompleted() {
    const navCompleted = document.querySelector('#complete-todos-title');
    navCompleted.addEventListener('click', () => {
      const filtered = this.getAllCompleted();
      this.currentLocation = 'complete';
      this.updateAllTodos();
      this.updateTitleCount('Completed', filtered.length);
    });
  }

  /*
  switchToCompleted switches the view to show all the todos when 'All Todos' is clicked
  */

  getAllCompleted(todos) {
    if (todos) {
      return todos.filter((todo) => todo.completed);
    }
    return this.allTodos.filter((todo) => todo.completed);
  }

  switchToAll() {
    const navAll = document.querySelector('#all-todos-title');
    navAll.addEventListener('click', () => {
      this.currentLocation = 'all';
      this.updateAllTodos(this.allTodos);
      this.updateTitleCount('All Todos', this.allTodos.length);
    });
  }

  /*
  switchToAll switches the view to show all the todos when 'All Todos' is clicked
  */

  enableCloseForm() {
    this.modal.addEventListener('click', (event) => {
      if (event.target.id === 'modal') {
        this.closeModal();
      }
    });
  }
  // enableCloseForm will hide the form menu if you click anywhere outside of the form.

  closeModal() {
    this.form.reset();
    this.modal.classList.add('hidden');
    this.fieldset.setAttribute('disabled', 'disabled');
    this.editTodoId = null;
    this.resetSelect();
  }

  showModal() {
    this.modal.classList.remove('hidden');
    this.fieldset.removeAttribute('disabled');
    this.enableCloseForm();
  }

  resetSelect() {
    const form = document.querySelector('form');
    const selects = form.querySelectorAll('select');

    selects.forEach((sel) => {
      Array.from(sel).forEach((op) => {
        op.removeAttribute('selected');
      });
    });
  }
}

export default View;
