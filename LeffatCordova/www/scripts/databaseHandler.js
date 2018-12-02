document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    databaseHandler.createDatabase();
    noteDatabaseHandler.createNoteDatabase();
   // noteDatabaseHandler.getNotes();

}



var loggeduser = null;

var databaseHandler = {
    db: null,
    createDatabase: function () {
        this.db = window.openDatabase(
            "users.db",
            "1.0",
            "usrs database",
            1000000);
        this.db.transaction(
            function (tx) {
                //Run SQL Here
                tx.executeSql(
                    "create table if not exists users(name varchar(30) primary key, password text)",  //create table if it doesn't exist'
                    [],
                    function (tx, results) { },
                    function (tx, error) {
                        console.log("Error while creating the table: " + error.message);
                    }
                );
            },
            function (error) {
                console.log("Transaction error:" + error.message);
            },
            function () {
                console.log("Create DB transaction completed successfully:");
            },
        );
    },
    addUser: function (name, password) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(  //get all info about users
                    "insert into users(name, password) values(?, ?)",
                    [name, password],
                    function (tx, results) { showNotification("", "Account successfully created"); login(); },
                    function (tx, error) {
                        console.log("add user error: " + error.message);
                        showNotification("", "User already exists");
                    }
                );
            },
            function (error) { },
            function () { }
        );
    },
    logOut: function () { //log off, clear user data
        loggeduser = null;
    },
    testUser: function () {
        databaseHandler.db.readTransaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * from users",
                    [],
                    function (tx, results) {
                        var length = results.rows.length;
                        var name = $("#lusername").val();
                        var password = $("#lpassword").val();
                        var ok = false;
                        for (var i = 0; i < length; i++) {
                            var username = results.rows.item(i).name;
                            var userpass = results.rows.item(i).password;

                            if (username == name && password == userpass) {
                                ok = true;
                                loggeduser = username; //we are logged in, remember that for login and future.
                                console.log("Logged in as:" + loggeduser);
                                noteDatabaseHandler.getNotes(); //get our notes
                            }
                        };

                        $("#lusername").val("");
                        $("#lpassword").val("");

                        if (ok == true) {
                            
                            showNotification("", "Login successful"); menu();
                        } else
                        {
                            showNotification("", "Invalid username or password");
                        }
                    },
                    function (tx, error) {
                        console.log("add user error: " + error.message);
                    }
                );
            }
        );
    },
}

var noteDatabaseHandler = {
    db: null,
    createNoteDatabase: function () {
        this.db = window.openDatabase(
            "notes.db",
            "1.0",
            "nts database",
            1000000);
        this.db.transaction(
            function (tx) {
                //Run SQL Here
                tx.executeSql(
                    "create table if not exists notes(n_id INTEGER primary key, name varchar(30), note text)",  //create table if it doesn't exist'
                    [],
                    function (tx, results) { },
                    function (tx, error) {
                        console.log("Error while creating the table: " + error.message);
                    }
                );
            },
            function (error) {
                console.log("Transaction error:" + error.message);
            },
            function () {
                console.log("Create note DB transaction completed successfully:");
            },
        );
    },
    addNote: function (note) {

        noteDatabaseHandler.db.transaction(
            function (tx) {
                var noteval = document.getElementById(note).value;
                tx.executeSql(  //get all info about users
                    "insert into notes(n_id, name, note) values(NULL, ?, ?)",
                    [loggeduser, noteval],
                    function (tx, results) {
                        document.getElementById(note).value = ""; //clear old data
                        noteDatabaseHandler.getNotes(); //refresh notes
                    },
                    function (tx, error) {
                        console.log("add note error: " + error.message);
                        showNotification("", error.message);
                    }
                );
            },
            function (error) { },
            function () { }
        );
    },
    
    delMe: function (n_id) {

        noteDatabaseHandler.db.transaction(
            function (tx) {
                tx.executeSql('DELETE FROM notes WHERE n_id = ?',
                    [n_id],
                    function (tx, results) {
                        noteDatabaseHandler.getNotes(); //success ,update
                        console.log("Deleted:" + n_id);
                    },
                    function (tx, error) {
                        console.log("add note error: " + error.message);
                    }
                );
            },
        );
    },
    
    getNotes: function () { //function for retrieving user notes
        noteDatabaseHandler.db.readTransaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * from notes",
                    [],
                    function (tx, results) {
                        var length = results.rows.length;
                        var ok = false;
                        var output = "";
                        document.getElementById('noteDiv').innerHTML = "";
                        for (var i = 0; i < length; i++) {
                            var username = results.rows.item(i).name;
                            var note = results.rows.item(i).note;
                            const n_id = results.rows.item(i).n_id;
                            console.log(loggeduser + ":" + username);
                            if (loggeduser === username) { //we found user's notes.
                                //var text = "<div class='blue-50' id='note" + i + "'><p>" + note + "</p></div>";
                                var x = document.createElement("DIV");
                                var dl = document.createElement("DIV");
                                var b = document.createElement("BUTTON");
                                var t = document.createTextNode(note);
                                x.appendChild(t);
                                b.className = "icon ion-trash-b small right";
                                b.style = "padding: 2px 2px 2px 2px;";
                               // b.onclick = noteDatabaseHandler.delMe(n_id);
                                b.addEventListener("click", function () { noteDatabaseHandler.delMe(n_id) }); 
                                x.appendChild(b);
                                x.className = "blue-50 margin-bottom shadow radius row";
                                x.style = "border-style: solid; border-width: 1px; border-radius: 5px;  padding: 5px 5px 5px 5px;";
                                dl.appendChild(x);
                                dl.className = "list";
                                document.getElementById('noteDiv').appendChild(dl);
                                

                               // output += text;
                            }
                        };
                       // document.getElementById('noteDiv').innerHTML = output;
                        

                    },
                    function (tx, error) {
                        console.log("Error: " + error.message);
                    }
                );
            }
        );
    },
}


function addUsername() {  //add user to db
    console.log("ADDUSER");
    var name = $("#username").val();
    var password = $("#password").val();

    databaseHandler.addUser(name, password);
    $("#username").val("");
    $("#password").val("");

}

function testUsername() { //test user for logging
    databaseHandler.testUser();
}


