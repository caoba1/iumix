// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Play buttons
var setplay = document.getElementsByClassName("setplay");


// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.remove();
    //div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

const enqueueButton = document.getElementById("enqueuePlaylist");
enqueueButton.addEventListener('click', function(){
    
  //TODO: LIMIT PLAYLIST TO FIVE LINKS
  //TODO: GRAB TITLE, DURATION, ID FROM SEARCH RESULTS, JUST ONCE!

    let selectionA = document.getElementById('search-results');
    console.log(selectionA.options[selectionA.selectedIndex]);
    var videoObjectAttribute = {
      title: selectionA.options[selectionA.selectedIndex].dataset.title,
      videoid: selectionA.options[selectionA.selectedIndex].dataset.videoid,
      duration: selectionA.options[selectionA.selectedIndex].dataset.duration
    }; //NEW!
    console.log(videoObjectAttribute);
    //newElement(selectionA.value);

    newElementAttribute(videoObjectAttribute);

}, false);



// Create a new list item when clicking on the "Add" button
function newElement(idValue) {
  var li = document.createElement("li");
  //if isYT 
  var inputValue = idValue;//getTitleFromId(idValue);
  console.log(idValue)
  
  //console.log(getTitleFromId(idValue));

  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  li.setAttribute('data-songId',idValue);
  

  if (inputValue === '') {
    alert("You must search something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  //TODO: Erase search results;?

  //Append the close button...
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  //TODO: Delete elemente instead of hiding it
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      //div.style.display = "none";
      div.remove();
    }
  }

}



// Create a new list item when clicking on the "Add" button
function newElementAttribute(videoObject) {
  var li = document.createElement("li");
  //if isYT 
  var inputValue = videoObject;//getTitleFromId(idValue);
  console.log(inputValue)
  


  //console.log(getTitleFromId(idValue));

  var t = document.createTextNode(videoObject.title);
  li.appendChild(t);
  li.setAttribute('data-title',videoObject.title);
  li.setAttribute('data-videoid',videoObject.videoid);
  li.setAttribute('data-duration',videoObject.duration);

  if (inputValue === '') {
    alert("You must search something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  //TODO: Erase search results;?


  // Append the play button...
  var spanset = document.createElement("SPAN");
  var txtset = document.createTextNode(">A");
  spanset.className = "setplay";
  spanset.appendChild(txtset);
  li.appendChild(spanset);
  //TODO: Delete elemente instead of hiding it
  for (i = 0; i < setplay.length; i++) {
    setplay[i].onclick = function() {
      var div = this.parentElement;
      //div.style.display = "none";
      div.className == 'checked'
      let toPlay = {title: div.dataset.title,
                    videoid: div.dataset.videoid,
                    duration: div.dataset.duration}
      setAudioAndPlayObject(toPlay, document.getElementById('audioStreamA'));
    }
  }

  //Append the close button...
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  //TODO: Delete elemente instead of hiding it
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      //div.style.display = "none";
      div.remove();
    }
  }

}