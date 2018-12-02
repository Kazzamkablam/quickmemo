setInterval(function () { realTime(); }, 1000); //for real time clock.
//setInterval(function () { noteDisplay(); }, 1000); //for real time clock.


function longtouch() {  //function for touching

}

function hideDiv(div) { //hide div
    var x = document.getElementById(div);
        x.style.display = "none";

} 

function realTime() {
    var dt = new Date();
    document.getElementById("datetime").innerHTML = dt.toLocaleDateString();
    document.getElementById("datetime2").innerHTML = dt.toLocaleTimeString();
};
function showDiv(div) { //show div
    var x = document.getElementById(div);
        x.style.display = "block";

} 

function menu() {
   showNotification("","Login successful");
    showDiv("main");
    hideDiv("login");

}

function register() {
    showDiv("register");
    hideDiv("login");
}

function login() {
    showDiv("login");
    hideDiv("register");
}

function logOut() { //log off, clear logged user and return to menu.
    databaseHandler.logOut();
    showDiv("login");
    hideDiv("main");
}

function showNotification(title,message) {
    navigator.notification.alert(message, alertDismissed, title,'Done');
}

function alertDismissed() {
    // do something
}
