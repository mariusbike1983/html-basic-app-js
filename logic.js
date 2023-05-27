/**
 * Functions that are calleable from the outside
 */
window.onload = function() {
    window.showCompleted = true;
    window.todos = _loadData();
    window.defaultPlaceholderText = "No items in list. Start adding one...";
    
    _renderTodoList();
}

function inputChanged(e) {
    if (e.key === "Enter") {
        addTodo();
    }
    document.getElementById("button-add").disabled = _getInputElement().value.length ===0;
}

function addTodo() {
    const newItem = _createNewModelItem(_getInputElement().value);
    window.todos.push(newItem);
    _getInputElement().value = "";
    _renderTodoItem(newItem);
    _updateListUi();
}

function toogleItem(itemId) {
    const item = window.todos.find(function(todo) { 
        return todo.id === itemId;
    });
    item.completed = !item.completed;
    const uiItem = _findUiItem(item.id);
    if (item.completed) {
        uiItem.classList.add("is-completed");
    } else {
        uiItem.classList.remove("is-completed");
    }
    _updateListUi();
}

function removeAll() {
    window.todos.splice(0, window.todos.length);
    _renderTodoList();
}

function toggleShow() {
    window.showCompleted = !window.showCompleted;
    document.getElementById("toggle-show").innerText = (window.showCompleted ? "Hide":"Show")+ " completed";
    _updateListUi();
}

/**
 *  Private methods, should not be called from the outside 
 */
function _generateNextId() {
    window.nextId = window.nextId ? window.nextId + 1 : 1;
    return window.nextId;
}

function _loadData() {
    const data = [];
    data.push(_createNewModelItem("Buy eggs"));
    const item = _createNewModelItem("Do the dishes");
    item.completed = true;
    data.push(item);
    return data;
}

function _createNewModelItem(itemText) {
    const newItem = {
        id: _generateNextId(),
        todo: itemText,
        completed: false
    }
    return newItem;
}

function _removeItem(itemId) {
    const ndx = window.todos.findIndex(todo => todo.id === itemId);
    const removedItem = window.todos.splice(ndx, 1)[0];
    _getTodoList().removeChild(_findUiItem(removedItem.id));
    _updateListUi();
}

function _renderTodoList() {
    const todos = window.todos;
    if (todos.length > 0) {
        _getTodoList().innerText = "";
        for(let i = 0; i < todos.length; i++) {
            const item = todos[i];
            item.id = _generateNextId();
            _renderTodoItem(item);
        }
    }
    _updateListUi();
}

function _getTodoList() {
    return document.getElementById("todo-list");
}

function _getInputElement() {
    return document.getElementById("todo-text-input");
}

function _findUiItem(itemId) {
    return document.querySelector('div[data-id="'+itemId+'"]');
}

function _renderTodoItem(itemModel) {
    // create the ui item based on the model
    const item = document.createElement("div");
    item.classList.add("item");
    if (itemModel.completed) {
        item.classList.add("is-completed");
    }
    const container = document.createElement('div');

    const check = document.createElement('input');
    check.type="checkbox";
    check.checked = itemModel.completed;
    check.onclick = () => toogleItem(itemModel.id);
    container.appendChild(check);

    const itemText = document.createElement("span");
    itemText.innerText = itemModel.todo;
    container.appendChild(itemText);

    item.appendChild(container);

    const itemButton = document.createElement("button");
    itemButton.innerHTML = "-";
    itemButton.classList.add("type_1");
    itemButton.onclick = () => _removeItem(itemModel.id);
    item.appendChild(itemButton);

    // bind ui item to the model, via the id
    item.setAttribute('data-id', itemModel.id);
    
    // insert the new ui item to the ui-todo-list
    _getTodoList().appendChild(item);
}

function _updateListUi() {
    // update the state of any ui elements
    document.getElementById("button-add").disabled = _getInputElement().value.length === 0;
    let listHasElements = window.todos.length > 0;
    document.getElementById("button-remove-all").disabled = !listHasElements;

    // update the display attributes for the whole list container
    if (!window.showCompleted && listHasElements) {
        // if the list should not show the completed items
        if (!window.todos.find(item => !item.completed)) {
            // no active items are found, therefore the list should be hidden
            listHasElements = false;
        }
        _getTodoList().style.display = listHasElements ? "": "none";
    } else {
        _getTodoList().style.display = "";
        if (!listHasElements) {
            _getTodoList().innerText = window.defaultPlaceholderText;
        }
    }

    // update the display attributes for each todo item
    for(let i = 0; i < window.todos.length; i++) {
        const todo = window.todos[i];
        const uiItem = _findUiItem(todo.id);
        if (window.showCompleted) {
            uiItem.style.display = '';
        } else {
            if (todo.completed) {
                uiItem.style.display = 'none';
            }
        }
    }
}