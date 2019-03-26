let db;

function initDatabase() {

    //create a unified variable for the browser variant
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    //if a variant wasn't found, let the user know
    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB.")
    };

    //attempt to open the database
    let request = window.indexedDB.open("list", 1);
    request.onerror = function (event) {
        console.log(event);
    };

    //map db to the opening of a database
    request.onsuccess = function (event) {
        db = request.result;
        console.log("success: " + db);

        readTodoList();
    };

    //if no database, create one and fill it with data
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("list", {
            keyPath: "id",
            autoIncrement: true
        });

    };
};



function count() {
    var objectStore = db.transaction("list").objectStore("list");



    //creates a cursor which iterates through each record
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            // something();
            cursor.continue();
        } else {
            console.log("No more entries!");
        };
    };
};


//adds a record as entered in the form
function add() {
    clearList();


    let todo = document.querySelector("#listItem").value;

    //create a transaction and attempt to add data
    var request = db
        .transaction(["list"], "readwrite")
        .objectStore("list")
        .add({
            todo: todo
            // something: item
        });

    //when successfully added to the database
    request.onsuccess = function (event) {
        console.log(`${listItem} has been added to your database.`);
        readTodoList();
    };

    //when not successfully added to the database
    request.onerror = function (event) {
        console.log(`Unable to add data\r\n${todo} is already in your database! `);
    };

};

//reads all the data in the database
function readTodoList() {


    var objectStore = db.transaction("list").objectStore("list");

    //creates a cursor which iterates through each record
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            console.log("todo: " + cursor.value.todo);
            addEntry(cursor.value.todo, cursor.value.id);
            cursor.continue();
        } else {
            console.log("No more entries!");
        };
    };
};


//deletes a record by id
function remove(id) {

    var request = db.transaction(["list"], "readwrite")
        .objectStore("list")
        .delete(id);
    clearList(id);
    readTodoList();


};

function addEntry(todo, id) {
    // Your existing code unmodified...
    var iDiv = document.createElement('div');
    iDiv.className = 'entry ';
    iDiv.innerHTML = todo + `<button class="thrash m-3 " onclick="remove(${id})">X</button>`;
    document.querySelector("#entries").appendChild(iDiv);
};

function clearList() {
    document.querySelector("#entries").innerHTML = "";
};


initDatabase();