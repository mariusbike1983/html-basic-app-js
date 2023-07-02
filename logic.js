/**
 * Functions that are callable from the outside
 */
window.onload = function() {
    window.showCompleted = true;
    window.todos = _loadData();
    window.defaultPlaceholderText = "No items in list. Start adding one...";
    
    _renderTodoList();
}

function inputChanged(e) {
    if (e.key === "Enter") {
        createNewTodoItem();
    }
    document.getElementById("button-add").disabled = _getInputElement().value.length === 0;
}

function createNewTodoItem() {
    const itemText = _getInputElement().value;
    const newItem = _createNewModelItem(itemText);
    window.todos.push(newItem);
    _getInputElement().value = "";
    _renderTodoItem(newItem);
    _updateListUi();
}

function updateItemState(itemId) {
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

function deleteAllItems() {
    window.todos.splice(0, window.todos.length);
    _getTodoList().replaceChildren()
    _renderTodoList();
}

function deleteItem(itemId) {
    const ndx = window.todos.findIndex(function(todo) {
        return todo.id === itemId;
    });
    window.todos.splice(ndx, 1)[0];
    _getTodoList().removeChild(_findUiItem(itemId));
    _updateListUi();
}

function toggleShow() {
    window.showCompleted = !window.showCompleted;
    document.getElementById("toggle-show").innerText = (window.showCompleted ? "Hide":"Show")+ " completed";
    _updateListUi();
}

/**
 *  Private methods, should not be called from the outside 
 */
function _shouldDisplayPlaceholder() {
    if (window.todos.length === 0) { // empty list, show placeholder
        return true;
    };
    // find at least one active (still not completed) element
    const activeItem = window.todos.find(function(item) {
        if (!item.completed) {
            return item;
        }
    });
    if (!activeItem && !window.showCompleted) { // no active items and the list hides completed items
        return true;
    }
    return false;
}

function _generateNextId() {
    window.nextId = window.nextId ? window.nextId + 1 : 1;
    return window.nextId;
}

function _loadData() {
    const data = [];
    data.push(_createNewModelItem("Buy eggs"));
    data.push(_createNewModelItem("Do the dishes", true));
    return data;
}

function _createNewModelItem(itemText, itemCompleted) {
    const newItem = {
        id:         _generateNextId(),
        todo:       itemText,
        completed:  itemCompleted
    }
    return newItem;
}

function _renderTodoList() {
    _renderPlaceholderText(window.defaultPlaceholderText);
    const todos = window.todos;
    for(let i = 0; i < todos.length; i++) {
        const item = todos[i];
        item.id = _generateNextId();
        _renderTodoItem(item);
    }
    _updateListUi();
}

function _getTodoList() {
    return document.getElementById("todo-list");
}

function _getInputElement() {
    return document.getElementById('todo-text-input');
}

function _findUiItem(itemId) {
    return document.querySelector('div[data-id="'+itemId+'"]');
}

function _renderPlaceholderText(text) {
    let placeholder = document.getElementById('placeholder');
    if (placeholder) {
        // we already have the placeholder created
        return;
    }
    placeholder = document.createElement('span');
    placeholder.innerText = text;
    placeholder.id = 'placeholder';
    placeholder.style.display = 'none';
    _getTodoList().appendChild(placeholder);
}

function _renderTodoItem(itemModel) {
    // create the ui item based on the model
    const item = document.createElement('div');
    item.classList.add("item");
    if (itemModel.completed) {
        item.classList.add("is-completed");
    }
    const container = document.createElement('div');

    const check = document.createElement('input');
    check.type="checkbox";
    check.checked = itemModel.completed;
    check.onclick = function() {
        updateItemState(itemModel.id);
    }
    container.appendChild(check);

    const itemText = document.createElement('span');
    itemText.innerText = itemModel.todo;
    container.appendChild(itemText);

    item.appendChild(container);

    const itemButton = document.createElement("button");
    itemButton.innerHTML = "-";
    itemButton.classList.add("type_1");
    itemButton.onclick = function() {
        deleteItem(itemModel.id)
    };
    item.appendChild(itemButton);

    // bind ui item to the model, via the id
    item.setAttribute('data-id', itemModel.id);
    
    // insert the new ui item to the ui-todo-list
    _getTodoList().appendChild(item);
}

function _updateListPlaceholderText() {
    const placeholder = document.getElementById('placeholder');
    placeholder.style.display = _shouldDisplayPlaceholder() ? '' : 'none';
}

function _updateListUi() {
    // update the state of any ui elements
    document.getElementById('button-add').disabled = _getInputElement().value.length === 0;
    let listHasElements = window.todos.length > 0;
    document.getElementById('button-remove-all').disabled = !listHasElements;

    _updateListPlaceholderText();

    // update the display attributes for each todo item
    for(let i = 0; i < window.todos.length; i++) {
        const todo = window.todos[i];
        const uiItem = _findUiItem(todo.id);
        if (window.showCompleted) {
            uiItem.style.display = '';
        } else if (todo.completed) {
            uiItem.style.display = 'none';
        }
    }
}