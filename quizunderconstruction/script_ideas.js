//make text appear a letter at a time like in videogames
//https://stackoverflow.com/questions/7264974/show-text-letter-by-letter
var showText = function (target, message, index, interval) {   
  if (index < message.length) {
    $(target).append(message[index++]);
    setTimeout(function () { showText(target, message, index, interval); }, interval);
  }
}

// A defferent approach?

var text = $('.typewriter').text();

var length = text.length;
var timeOut;
var character = 0;


(function typeWriter() { 
    timeOut = setTimeout(function() {
        character++;
        var type = text.substring(0, character);
        $('.typewriter').text(type);
        typeWriter();
        
        if (character == length) {
            clearTimeout(timeOut);
        }
        
    }, 200);
}());

//impossible quiz-y type thing
//https://codepen.io/Emilyrb/pen/MbdRmP

//new structure for eventType handling (if I plan to add more event types, idk if I will)
const eventIndices = {
  questions: () => currentQInd, //when eventIndices['questions']() is called, it will return currentQInd
                                //with ce = 'questions', I can call eventIndices[ce]() for the index
                                //I don't have to change the code elsewhere (I think)
  interlude: () => currentIntInd,
  // more event types in the future
};

//THIS COULD MAKE ADDING DIFFERENT ENDINGS PRETTY EASY??

function nextEvent() {
  let evInd = eventIndices[ce]?.(); // safely call the index function
  let ne = quiz[ce][evInd].nextEvent;

  if (!ne) return loadQuestion(++currentQInd);
  if (ne === "interlude") return loadInterlude(currentIntInd++);
}

//or handle index and increment in the same map
const eventHandlers = {
  questions: {
    getIndex: () => currentQInd,
    next: () => loadQuestion(++currentQInd)
  },
  interlude: {
    getIndex: () => currentIntInd,
    next: () => loadInterlude(currentIntInd++)
  },
  // more types...
};

function nextEvent() {
  let handler = eventHandlers[ce];
  let ne = quiz[ce][handler.getIndex()].nextEvent;

  return !ne ? eventHandlers.questions.next() : 
         ne === "interlude" ? eventHandlers.interlude.next() : 
         undefined; // or handle other cases
}