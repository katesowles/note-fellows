var userLibrary = [];
var tempNoteId; // this control flow allows us to avoid errors when switching between html pages

if (document.title === 'Welcome to Note Fellows!') { // index.html
  if (localStorage.userIndex && localStorage.userLibrary) {
    var userIndex = JSON.parse(localStorage.getItem('userIndex'));
    userLibrary = JSON.parse(localStorage.getItem('userLibrary'));
    $('#loginForm').append(returnUserForm('loginTemplate', 'returningUserContext'));
    // $('#loginForm').append(login.returnUserForm('loginTemplate', 'returningUserContext'));
    // if userIndex and userLibrary exist in localStorage, show returningUserForm
  }
  else {
    // $('#loginForm').append(newUserForm('loginTemplate', 'newUserContext'));
    $('#loginForm').append(newUserForm());
    // $('#loginForm').append(login.newUserForm('loginTemplate', 'newUserContext'));
    // if userIndex and userLibrary DO NOT exist in localStorage, show newUserForm
  }
}
else if (document.title === 'Note Fellows') { // notes.html
  if (localStorage.userIndex) {
    var userIndex = JSON.parse(localStorage.getItem('userIndex'));
    userLibrary = JSON.parse(localStorage.getItem('userLibrary'));
  }
  var el = $('#noteList');
  el.addEventListener('click', function(e) {NoteTracker.getNote(e);},false);
}
/***************OBJECT CONSTRUCTORS***************/
function User (username, password, library, tagLibrary) {
  this.username = username;
  this.password = password;
  this.library = library;
  this.tagLibrary = tagLibrary;
  userLibrary.push(this);
}
function Note (noteTitle, noteContent) {
  this.noteTitle = noteTitle;
  this.noteContent = noteContent;
  this.noteTags = [];
  this.noteIndex = 0;
}
/******************GLOBAL FUNCTIONS***************/

function newUserForm (event) {

  document.getElementById('loginForm').innerHTML = '<form name="loginform" class="whiteText" id="newUser"><fieldset><legend>New User</legend><label>Username</label><input class="labelColor" type="text" name="usr" placeholder="username" required="required"><label>Password</label><input class="labelColor" type="password" name="pword" placeholder="password" required="required"><p id="msg"></p><input class="button-primary" type="submit" value="Create New User"></fieldset></form><input class="button-primary" type="submit" value="Switch to Login Page" id="existingButton">';

  var newUserEl = document.getElementById('newUser');
  newUserEl.addEventListener('submit', function(e) {login.newUser(e);},false);
  var existingButton = document.getElementById('existingButton');
  existingButton.addEventListener('click', function(e) {returnUserForm(e);},false);
}

function returnUserForm (event) {

  document.getElementById('loginForm').innerHTML = '<form name="loginform" class="whiteText" id="returnUser"><fieldset><legend>Returning User</legend><label>Username</label><input class="labelColor" type="text" name="usr" placeholder="username" required="required"><label>Password</label><input class="labelColor" type="password" name="pword" placeholder="password" required="required"><p id="msg"></p><input class="button-primary" type="submit" value="Login"></fieldset></form><input class="button-primary" type="submit" value="Create New User" id="newButton">';

  var returnUserEl = document.getElementById('returnUser');
  returnUserEl.addEventListener('submit', function(e) {login.returnUser(e);},false);
  var newButton = document.getElementById('newButton');
  newButton.addEventListener('click', function(e) {newUserForm(e);},false);
}

/***************OBJECT LITERAL******************/
var NoteTracker = {

  currentIndex: userIndex,

  newNote: function (event) {
    event.preventDefault();
    var noteTitle = event.target.noteTitle.value;
    var noteTag = event.target.noteTag.value;
    var noteContent = event.target.noteContent.value;
    var temp = new Note (noteTitle, noteContent);
    temp.noteIndex = userLibrary[userIndex].library.length;
    if (noteTag.length > 0) {
      temp.noteTags.push(noteTag);
      if (userLibrary[userIndex].tagLibrary.indexOf(noteTag) === -1) {
        userLibrary[userIndex].tagLibrary.push(noteTag);
      }
    }
    userLibrary[userIndex].library.push(temp);
    localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
    this.sendToBrowser(temp);
  },
  deleteTag: function(tag) {// deletes specified tag from user's library
    var toBeDeleted = userLibrary[userIndex].tagLibrary.indexOf(tag);
    userLibrary[userIndex].tagLibrary.splice(toBeDeleted,1);
  },
  checkTagExists: function(tag) {
    var tagExists = false;
    for (var j = 0; j < userLibrary[userIndex].library.length; j++) {
      for (var k = 0; k < userLibrary[userIndex].library[j].noteTags.length; k++) {
        if (userLibrary[userIndex].library[j].noteTags.indexOf(tag) !== -1) {
          tagExists = true;
          break;
        }
      }
    }
    return tagExists;
  },
  deleteNote: function(event) {
    event.preventDefault();
    // adjust note indices
    for (var j = tempNoteId + 1; j < userLibrary[userIndex].library.length; j++) {
      userLibrary[userIndex].library[j].noteIndex--;
    }
    var tempTags = [];// store the tags to be deleted before deleting the note
    for (var k = 0; k < userLibrary[userIndex].library[tempNoteId].noteTags.length; k++) {tempTags.push(userLibrary[userIndex].library[tempNoteId].noteTags[k]);}
    userLibrary[userIndex].library.splice(tempNoteId, 1); //delete the note
    // check if the tags attached to the deleted note exist in the updated library
    for (var i = 0; i < tempTags.length; i++) {
      // if no other instances exist, then delete the tag from the user's tag library
      if (!this.checkTagExists(tempTags[i])) {
        this.deleteTag(tempTags[i]);
      }
    }
    localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
    userLibrary = JSON.parse(localStorage.getItem('userLibrary'));
    this.clearNoteBrowser();
    this.clearForm();
    this.createForm();
    NoteTracker.sendAll();
  },
  getTarget: function (e) {
    return e.target || e.srcElement;
  },
  getNote: function (e) {
    var target = this.getTarget(e);
    var elParent = target.parentNode;
    var noteID = elParent.id.slice(7);//slice iD to get array position
    tempNoteId = parseInt(noteID);    // noteID is a string! tempNoteId is an int!
    this.displayNote(tempNoteId);
  },
  sendToBrowser: function (note) {
    var elList = document.createElement('li');    // new list element
    elList.setAttribute('id', 'counter' + note.noteIndex);

    var elTitle = document.createElement('p');    // note title
    elTitle.textContent = note.noteTitle;
    elList.appendChild(elTitle);

    var elNote = document.createElement('p');     // note tag
    elNote.textContent = note.noteTags;
    elList.appendChild(elNote);

    el.appendChild(elList);
  },
  sendAll: function () {
    for (var i = 0; i < userLibrary[userIndex].library.length; i++) {
      this.sendToBrowser(userLibrary[userIndex].library[i]);
    }
  },
  clearNoteBrowser: function () {
    document.getElementById('noteList').innerHTML = '';
  },
  clearForm: function () {
    $('#displayWindow').empty();
  },
  tagsDropDown: function() {
    userLibrary = JSON.parse(localStorage.getItem('userLibrary'));
    var menu = '<form id="tagForm">Search By Tags: <select id="noteTags" onchange="NoteTracker.searchForTag(this.value)"><option class="tagColor" value="none">None</option>';
    for (var i = 0; i < userLibrary[userIndex].tagLibrary.length; i++) {
      menu += '<option class="tagColor" value="' + userLibrary[userIndex].tagLibrary[i] + '">' + userLibrary[userIndex].tagLibrary[i] + '</option>';
    }
    menu += '</select></form>';
    return menu;
  },
  assignTags: function(){
    var select = document.getElementById('multipleTags');
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i = 0; i < options.length; i++){
      opt = options[i];
      if (opt.selected) {
        if (userLibrary[userIndex].library[tempNoteId].noteTags.indexOf(opt.value) === -1)
        {userLibrary[userIndex].library[tempNoteId].noteTags.push(opt.value);}
      }
    }
    localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
    userLibrary = JSON.parse(localStorage.getItem('userLibrary'));
  },
  removeTags: function () {
    var select = document.getElementById('multipleTags');
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i = 0; i < options.length; i++) {
      opt = options[i];
      if (opt.selected) {
        var x = userLibrary[userIndex].library[tempNoteId].noteTags.indexOf(opt.value);
        if (x !== -1) {
          userLibrary[userIndex].library[tempNoteId].noteTags.splice(x,1);
          if (!this.checkTagExists(opt.value)) {NoteTracker.deleteTag(opt.value);}
        }
      }
    }
    localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
    userLibrary = JSON.parse(localStorage.getItem('userLibrary'));
  },
  tagsMultipleSelect: function() {
    var menu = '<form><select id="multipleTags" size="5" multiple="multiple">';
    for (var i = 0; i < userLibrary[userIndex].tagLibrary.length; i++) {
      menu += '<option value="' + userLibrary[userIndex].tagLibrary[i] + '">' + userLibrary[userIndex].tagLibrary[i] + '</option>';
    }
    menu += '</select><button class="button button-primary alignButtons" onclick="NoteTracker.assignTags();">Assign</button><button class="button button-primary alignButtons" onclick="NoteTracker.removeTags();">Remove</button></form>';
    return menu;
  },
  createForm: function() {
    this.clearForm();

    //create dummy note with empty title and content to pass into #createOrEditNote template
    var blankNote = {
      createOrEdit: 'Create New Note',
      noteTitle: '',
      noteContent: '',
      submitValue: 'Create a New Note'
    };

    //append populated #createOrEditNote template to #displayWindow div
    var createOrEditTemplate = $('#createOrEditNote').html();
    var templateFunction = Handlebars.compile(createOrEditTemplate);
    var htmlToAppend = templateFunction(blankNote);
    $('#displayWindow').append(htmlToAppend);

    newNoteInput = document.getElementById('textInput');
    newNoteInput.addEventListener('submit', function(e) {NoteTracker.newNote(e);
      NoteTracker.createForm();},false);
  },
  updateForm: function(e){
    userLibrary[userIndex].library[tempNoteId].noteTitle = e.target.noteTitle.value;
    userLibrary[userIndex].library[tempNoteId].noteContent = e.target.noteContent.value;
    if (e.target.noteTag.value !== '') {
      if (!NoteTracker.checkTagExists(e.target.noteTag.value)){
        userLibrary[userIndex].library[tempNoteId].noteTags.push(e.target.noteTag.value);
      }
      if (userLibrary[userIndex].tagLibrary.indexOf(e.target.noteTag.value) === -1) {
        userLibrary[userIndex].tagLibrary.push(e.target.noteTag.value);
      }
    }
    localStorage.setItem('userLibrary', JSON.stringify(userLibrary));
    NoteTracker.createForm();
  },
  editNote: function(e) {
    e.preventDefault();
    var noteID = tempNoteId;

    this.clearForm();
    var noteToEdit = userLibrary[this.currentIndex].library[noteID];
    noteToEdit.createOrEdit = 'Edit Note';
    noteToEdit.submitValue = 'Update Note';

    //append populated #createOrEditNote template to #displayWindow div
    var createOrEditTemplate = $('#createOrEditNote').html();
    var templateFunction = Handlebars.compile(createOrEditTemplate);
    var htmlToAppend = templateFunction(noteToEdit);
    $('#displayWindow').append(htmlToAppend);

    var newNoteInput = document.getElementById('textInput');
    newNoteInput.addEventListener('submit', function(e) {NoteTracker.updateForm(e);},false);
  },
  displayNote: function(noteID) {
    //empty #displayWindow div
    this.clearForm();
    var noteToDisplay = userLibrary[this.currentIndex].library[noteID];

    //append populated #noteDisplay template to #displayWindow div
    var noteDisplayTemplate = $('#noteDisplay').html();
    var templateFunction = Handlebars.compile(noteDisplayTemplate);
    var htmlToAppend = templateFunction(noteToDisplay);
    $('#displayWindow').append(htmlToAppend);

    var editButton = document.getElementById('editbutton');
    editButton.addEventListener('click', function(e){NoteTracker.editNote(e);}, false);
    var deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', function(e){NoteTracker.deleteNote(e);}, false);
    var newNoteButton = document.getElementById('newNoteButton');
    newNoteButton.addEventListener('click', function(e){NoteTracker.createForm();}, false);

  },
  searchForTag: function (tag) {
    NoteTracker.clearNoteBrowser();
    if (tag === 'none') {NoteTracker.sendAll();}
    var temp = [];
    for (var i = 0; i < userLibrary[userIndex].library.length; i++) {
      var x = userLibrary[userIndex].library[i];
      for (var j = 0; j < userLibrary[userIndex].library[i].noteTags.length; j++) {
        if (userLibrary[userIndex].library[i].noteTags[j] === tag) {
          temp.push(i);
          NoteTracker.sendToBrowser(x);
          break;
        }
      }
    }
  }
};

if (document.title === 'Note Fellows') {
  NoteTracker.sendAll();
  NoteTracker.createForm();
}
