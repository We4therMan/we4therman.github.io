//make text appear a letter at a time like in videogames
//https://stackoverflow.com/questions/7264974/show-text-letter-by-letter
var showText = function (target, message, index, interval) {   
  if (index < message.length) {
    $(target).append(message[index++]);
    setTimeout(function () { showText(target, message, index, interval); }, interval);
  }
}

//impossible quiz-y type thing
//https://codepen.io/Emilyrb/pen/MbdRmP