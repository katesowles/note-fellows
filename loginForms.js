(function(module) {

  var login = {};

  // login.newUserForm = function (event) {
  //   var newUserContext = {
  //     formId              :   'newUser',
  //     formLegend          :   'New User',
  //     innerButtonValue    :   'Create New User',
  //     outerButtonValue    :   'Switch to Login Page',
  //     outerButtonId       :   'existingButton'
  //   };
  //
  //   $('#newUser').on('submit', function(e) {login.newUser(e);},false);
  //   $('#existingButton').on('click', function(e) {login.returnUserForm(e);},false);
  //
  //   var source   = $('#loginTemplate').html();
  //   var template = Handlebars.compile(source);
  //   return template(newUserContext);
  // };
  //
  // login.returnUserForm = function (event) {
  //   var returnUserContext = {
  //     formId              :   'returnUser',
  //     formLegend          :   'Return User',
  //     innerButtonValue    :   'Switch to Login Page',
  //     outerButtonValue    :   'Create New User',
  //     outerButtonId       :   'newButton'
  //   };
  //
  //   $('#returnUser').on('submit', function(e) {login.returnUser(e);},false);
  //   $('#newButton').on('click', function(e) {login.newUserForm(e);},false);
  //
  //   var source   = $('#loginTemplate').html();
  //   var template = Handlebars.compile(source);
  //   return template(returnUserContext);
  // };

  login.newUser = function (event) {
    event.preventDefault();
    var username = event.target.usr.value;
    var password = event.target.pword.value;
    var msg = $('#msg');
    var library = [];
    var tags = [];
    var userExists = false;

    for (var i = 0; i < userLibrary.length; i++) { // checks to see if user exists in that computer's local storage
      if (userLibrary[i].username === username) {
        msg.textContent = 'Username taken';
        userExists = true;
      }
    }

    if (!userExists) { // if user does NOT exist
      var temp = new User(username, password, library, tags);
      NoteTracker.currentUser = temp;
      var x = userLibrary.length - 1;
      localStorage.setItem('userIndex', JSON.stringify(x));
      localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
      window.location = 'notes.html';
    }
  };

  login.returnUser = function (event) {
    event.preventDefault();
    var username = event.target.usr.value;
    var password = event.target.pword.value;
    var msg = $('#msg');
    var userExists = false;

    for (var i = 0; i < userLibrary.length; i++) {
      if (userLibrary[i].username === username && userLibrary[i].password === password) { // checks to see if username and password both match
        NoteTracker.currentUser = userLibrary[i];
        localStorage.setItem('userIndex', JSON.stringify(i));
        localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
        window.location = 'notes.html';
      }
      if (userLibrary[i].username === username && userLibrary[i].password !== password) { // if username is correct but password is not...
        msg.textContent = 'Incorrect Password';
        userExists = true;
      }
    }
    if (!userExists) {$('#msg').textContent = 'User Does Not Exist';}
  };

  module.login = login;

})(window);
