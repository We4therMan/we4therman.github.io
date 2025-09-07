//sound variables
//these const variables are what cause the two 'AudioContext not allowed to start' errors. The errors are benign.
const mus = new Tone.ToneAudioBuffers({
  urls: {
    firstfew: "aud/mus_thefirstfew_0.ogg",
    firstfew_w: "aud/mus_thefirstfew_w.ogg",
    //interlude: "aud/mus_interlude.ogg", //TODO write this song lol
    jonas: "aud/mus_jonas.ogg",
  },
  onload: () => {
    console.log("Music buffers loaded")
  }
});

const sfx = new Tone.ToneAudioBuffers({
  urls: {
    wrong: "aud/snd_wrong.ogg",
    correct: "aud/snd_correct.ogg",
    tic: "aud/snd_tic.ogg",
    blip: "aud/snd_blip.ogg",
    gameover: "aud/snd_gameover.ogg",
    jonas: "aud/snd_jonas.ogg",
    girl: "aud/snd_girl.ogg"
  },
  onload: () => {
    console.log("sfx buffers loaded")
  }
});

let musPlayer;
let sfxPlayer;
let distortion;
var musVol = -5;
var sfxVol = -5;

//question variables
const questions = quiz.questions
const interludes = quiz.interludes
var currentQInd;
var currentIntInd;

const indOf = {
  questions: () => currentQInd,
  interludes: () => currentIntInd,
}

var isCorrect = false;

//score variables
var correctScore = 0;
var angScore = 0;
var angStage = 0;
var failing = false;
var playedAnswers = [];
var timeOuts = 0;
var easyMode = false;

//route variables
var burgerOn = false;
var cumOn = false;
var yairOn = false;
//'-Ans' names of special answers in quiz-data.js
const specialKeys = ['burgerAns', 'cumAns','yairAns'];

//UI variables
let ce = "intro"; //defines current event; MUST MATCH quiz-data ARRAY NAMES (i.e. 'questions' with an s)
let ticRate = 200;
let timeCounter;
let buttonAnsTimer;
let btnTimeouts = [];
let ansClicks = 0;
let delay;
let speedUp = false;
let allAnswersLoaded = true;

$(function() {
  $("#startButton").on("click", async function() {
    await Tone.start();
    //initiate music player
    musPlayer = new Tone.Player().toDestination();
    musPlayer.buffer = mus.get("firstfew");
    musPlayer.loop = true;
    musPlayer.volume.value = musVol;
    musPlayer.start();
    console.log("Music started")

    //initiate sfx player
    sfxPlayer = new Tone.Player().toDestination();
    sfxPlayer.volume.value = sfxVol;
    console.log("SFX player initialized")

    //initiate effect plugins
    // distortion = new Tone.Distortion(0.2).toDestination();

    $("#startButton").hide();

    //POWERFUL: the most frequent updater. Most useful for keeping angerstage updated at all times.
    $(document).on('click', function() {
      console.log("the page has been clicked on....... somewhere")
      showAnger(angStage);
    })

    setTimeout(() => {
      initQuiz();
    }, 10)
  });

  $("#nextButton").on("click", function(){
    clearTimeout(buttonAnsTimer);
    nextEvent();
  });

  $("#contButton").on("click", function(){
    nextEvent();
  })
//TODO: make interludes end with ready, continue is for revealing the endInterlude text
  $("#readyButton").on("click", function(){
    nextEvent();
  })

  $("#musVolume").on("input", function() {
    musVol = parseFloat(this.value);
    musPlayer.volume.value = parseFloat(this.value);
    musPlayer.mute = (this.value <= -30.0) ? true : false;
  });

  $("#sfxVolume").on("input", function() {
    sfxVol = parseFloat(this.value);
    sfxPlayer.volume.value = sfxVol;
    sfxPlayer.mute = (sfxVol <= -30.0) ? true : false;
  });
})

function initQuiz() {
  console.log("Initializing quiz");
  //reset variables
  correctAnswers = 0, currentQInd = 0, currentIntInd = 0, angScore = 0, angStage = 0, timeOuts = 0;
  resetSpecials(); //don't know why this is a function and the above is not. I guess they're not special.
  $(".quizWelcome").hide();
  $("#quizContainer").show();
  //reassign button function
  $("#nextButton").off("click").on("click", function(){
    clearTimeout(buttonAnsTimer);
    nextEvent();
  }).text("Next");
  loadQuestion(currentQInd);
}

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  ansClicks = 0
  allAnswersLoaded = false;
  console.log(`initializing question ${currentQInd+1}`);
  ce = "questions"
  $("#quizContainer, #result").show();
  $("#quizContainer, #result").empty();
  $("#nextButton, #contButton, #intContainer").hide();
  //load in question data
  let q = questions[currentQInd];
  let data = qData(currentQInd);
  let currQuestion = data[0];
  let currAnsSet =  data[1];
  let currRepSet =   data[2];
  let currAngSet =   data[3];
  let currCorrAns =  data[4];
  let sus =          data[5];
  let timeLim =      (easyMode) ? (1.5 * data[6]) : data[6]; //time limit longer in easy mode
  window[q.callSpec]?.(); //call special event function if qData has one
  ticRate = (sus) ? 1000 : 200; //slow tics for high suspense
  sfxPlayer.buffer = sfx.get("tic"); //load tic to player

  let specil = checkGetSpecial(currentQInd, specialKeys);
  let specilKs = Object.keys(specil), specilIs = Object.values(specil);
  let answersGenerated = 0;

  currAnsSet.forEach((currAns,ansInd) => { //answer options and indices
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currRepSet[ansInd] //replies
    //console.log(`loadquestion curr ans "${currAns}" curr ang ${currAng} curr reply "${currRep}" correct answer indeces ${currCorrAns}`);
    let isCorrect = currCorrAns.includes(ansInd), isSpecil = specilIs.includes(ansInd); //check tags
    let specilK = specilKs.find(k => specil[k] === ansInd); //find matching special key (can handle multiple specials in one question)

    if (ansClicks) {
      delay = 0; //generate the rest of the buttons if one is clicked
    } else if (speedUp) {
      delay = (ansInd + 1) * 50; //fast version if speedup key is pressed down
    } else {
      delay = (ansInd + 1) * ticRate; //normal speed
    }

    let buttonAnsTimer = setTimeout(() => {
      answersGenerated++;
      if (answersGenerated === currAnsSet.length) allAnswersLoaded = true;
      generateAns(ansInd, isCorrect, currAns, currAng, currRep, specilK, isSpecil);
      if (!ansClicks) sfxPlayer.start(); //play tic
    }, delay); //todo: make timeout 0 if skip option is true
    btnTimeouts.push(buttonAnsTimer);
  });

  musPlayer.playbackRate = sus ? 0.90 : 1.0

  $("#question")
    .html(`${(currentQInd + 1).toString()}. ${currQuestion}`)
    .css({"color": "white", "font-size": "48px"});
  genTimer(timeLim);
  // $("#timerContainer").fadeIn(3000); //REMOVE THIS LINE WHEN YOU'RE DONE TESTING
};

//t should be in seconds
function genTimer(t) {
  //clear old timer
  let con = $("#timerContainer")
  if (t > 10.0) con.empty().hide(); //
  //create timer element
  let timer = $("<span />")
    .addClass("timer")
    .html(`${t.toFixed(2)}`)
  //append to question element
  con.append(timer)
  //update timer every 0.1 s
  timeCounter = setInterval(() => {
    t -= 0.01
    timer.html(`${t.toFixed(2)}`);
    //reveal only at 10 seconds left
    if (t < 10) con.fadeIn(3000);
    if (t < 5) timer.css({"color": "red"});
    if (t <= 0.001) timesUp();
  }, 10)

}

function stopGenAns() {
  console.log("killing generator")
  btnTimeouts.forEach(clearTimeout);
  btnTimeouts = [];

  let currAnsSet = qData(currentQInd)[1];
  let specil = checkGetSpecial(currentQInd, specialKeys);
  let specilKs = Object.keys(specil), specilIs = Object.values(specil);

  currAnsSet.forEach((currAns, ansInd) => {
    //if the button already exists, skip to avoid duplicates
    if ($(`#ans-${ansInd}`).length > 0) return;
    let currRep = qData(currentQInd)[2];
    let currAng = qData(currentQInd)[3];
    let isCorrect = qData(currentQInd)[4].includes(ansInd);
    let isSpecil = specilIs.includes(ansInd);
    let specilK = specilKs.find(k => specil[k] === ansInd);
    generateAns(ansInd, isCorrect, currAns, currAng, currRep, specilK, isSpecil);
  });
}


function selectTexts(ind) {
  let fail = failing, angry = (angStage > 0), burger = burgerOn, cum = cumOn; //update variables for state
  let states = {fail, angry, burger, cum} //all possible selectors as simple boolean states (update as more are added)
  const intSet = interludes[ind];

  //selects only one matching restTxt
  //it will select the first activated specialKey it finds, so priority order is set in the interlude object
  let restKey = Object.keys(intSet.restTxts).find(key => key !== 'reg' && states[key]) || 'reg'; 
  let restTxt = intSet.restTxts[restKey]
  //ditto for readyTxts
  let readyKey = Object.keys(intSet.readyTxts).find(key => key !== 'reg' && states[key]) || 'reg';
  let readyTxt = intSet.readyTxts[readyKey]
  //select any activated specialTxts (can be multiple)
  let specialTxts = Object.keys(intSet.specialTxts)
    .filter(key => states[key])
    .map(key => intSet.specialTxts[key])

  return [restTxt, specialTxts, readyTxt].flat().filter(Boolean); //blank arrays/strings could be included, so filter them out
};

function loadInterlude(ind) {
  ce = "interludes"
  $("#quizContainer, #intContainer, #question, #result").empty();
  $("#quizContainer, #nextButton").hide();
  $("#intContainer").show();
  sfxPlayer.buffer = sfx.get("blip");

  failing = (correctScore/currentQInd < 0.5) ? true : false;

  let intTxts = selectTexts(ind)

  //show continue button last
  setTimeout(() => {
    $("#contButton").show();
    sfxPlayer.start();
  }, (intTxts.length) * 1000);

  //show intTxts sequentially
  intTxts.forEach((intTxt,txtInd) => {
    var intTimer = setTimeout(() => {
      generateIntTxt(intTxt);
      sfxPlayer.start();
    }, txtInd * 1000);
  })
};

//
function checkGetSpecial(ind,spKeys){
  return spKeys
    .filter(spKey => questions[ind].hasOwnProperty(spKey)) //make a new array of only the present keys
    .reduce((result, spKey) => {
      result[spKey] = questions[ind][spKey];
      return result;
    }, {});
};

function resetSpecials(){
  burgerOn = false, cumOn = false, easyMode = false;
  console.log("special keys reset")
}

//on button press, if button is special, activate key
function setSpecials(key){ 
  switch (key) {
        case "burgerAns":
          burgerOn = true;
          console.log("BURGER ACTIVATED");
          break;
        case "cumAns":
          cumOn = true;
          console.log("CUM ACtiVATED");
          break;
        default:
          console.log(`no special key`);
          break;
      }
};

function generateAns(bInd,isCorrect,ans,ang,rep,specil,isSpecil){
  var button = $('<button />') 
    .addClass("multChoice")
    .attr("id",`ans-${bInd}`)
    .html(ans)
    .data({ans,isCorrect,ang,rep,specil})
    .on("click", function(){
      let data = $(this).data();
      result(data.isCorrect,data.ang,data.rep);
      playedAnswers.push(ans);
      if (isSpecil) {
        setSpecials(specil);
      }
    });

  if (angStage > 0) {button.addClass("angPulse")}
  if (angStage > 1) {button.addClass("angShake")}

  $("#quizContainer").append(button);
}

//create <p> element with a given string. For interlude text
function generateIntTxt(txt) {
  var t = $('<p />')
  .addClass("intTxt")
  .html(txt);

  $("#intContainer").append(t);
  // $("#intContainer").append("<br>")
};

//handle answer choice
function result(isCorrect,ang,rep) {
  ansClicks = 1;
  if (!allAnswersLoaded) stopGenAns();
  clearInterval(timeCounter);
  angScore += ang;
  pulseBG(isCorrect ? "#007d00" : "#7d0400");
  if (isCorrect) correctScore++;
  sfxPlayer.buffer = sfx.get(isCorrect ? "correct" : "wrong");
  sfxPlayer.start();

  $("#result").html(rep)
  //disable buttons upon click
  $(".multChoice").off("click").on("click", function(){
    ansClicks++;
    switch (ansClicks) {
      case 5:
        $("#question").text("Hey, you already picked an answer. Move on to the next question.");
        break;
      case 15:
        $("#question").text("...stop that.");
        angScore += 5;
        break;
      case 30:
        $("#question").text("Now you're really pushing my buttons... haha.");
        angScore += 10;
        break;
      case 45:
        $("#question").text("ok it's actually not funny. please stop, seriously");
        angScore += 50;
        break;
      case 60:
        $("#question").text("you're irritating, you know that?");
        angScore += 70;
        break;
      case 75:
        $("#question").text("JESUS CHRIST STOP").css({"color": "red"});
        angScore += 250;
        break;
      case 100:
        gameOver();
        $("#question").html("OK, I don't know what you're trying to achieve here. I'm making you start over. DON'T DO IT AGAIN.<br><br>GAME OVER");
        break;
    }
  })
  //console.log(angScore, correctScore);
  checkAnger(angScore);
  showAnger(angStage);
  musPlayer.playbackRate = 1.0;
  $("#nextButton").show();

  if (angStage === 3) gameOver();
}

function pulseBG(color,pulseLength = 2) {
  const bg = $(".background")
  bg.css({"transition": "none", "background-color": color})
  setTimeout(() => {
    bg.css({"transition": `background-color ${pulseLength}s ease`, "background-color": "black"})
  }, 5);
}

function checkAnger(ang) {
  switch (true) {
    case ang < -100:
      angStage = -2
      break;
    case ang >= -100 && ang < -50:
      angStage = -1
      break;
    case ang >= -50 && ang <= 50:
      angStage = 0
      break;
    case ang > 50 && ang <= 100:
      angStage = 1
      break;
    case ang > 100 && ang < 150:
      angStage = 2
      break;
    case ang >= 150:
      angStage = 3
      break;
  }
};

function showAnger(stage) {
  if (stage <= 0) {
      $(".multChoice").attr("background-color", "white");
      $(".multChoice").attr("border-color", "gray");
      sfxPlayer.playbackRate = 1;
  }

  if (stage >= 1) {
      $(".multChoice").addClass("angPulse");
      sfxPlayer.playbackRate = 0.8;
  }

  if (stage >= 2) {
      // $(".multChoice").addClass("angShake");
      sfxPlayer.playbackRate = 0.6;
      // musPlayer.connect(distortion)
      // TODO: make angry versions of songs and sfx
  }
}

// function shake(element){
//   const shakeAmt = Math.round(Math.random() * 5) - 1;
//   const shakeAmt2 = Math.round(Math.random() * 5) - 1;
//   $(element).animate({
//     left: `+=${shakeAmt}px`,
//     down: `+=${shakeAmt2}px`
//   }, 1000, function() {
//     $(element).animate({
//       left: `-=${shakeAmt}px`,
//       down: `-=${shakeAmt2}px`,
//     }, 1000, function() {
//       shake(element);
//     });
//   });
// }

function nextEvent() {
  let evInd = indOf[ce]?.(); //select index of current event
  let ne = quiz[ce][evInd].nextEvent //check if ce has nextEvent label and store it
  console.log("NEXT EVENT DATA",ce,currentQInd,currentIntInd,ne)

  if (!ne) return loadQuestion(++currentQInd); //if no label, update index and load next question
  else if (ne === "interlude") return loadInterlude(currentIntInd++); //if interlude, load interlude and update index
}

function gameOver() {
  $("#question").text("GAME OVER").css({"color": "red", "font-size": "76px"});
  $("result").css({"color": "red"});
  $("#nextButton").off("click").on("click", function(){
    initQuiz()
  }).text("START OVER");
  musPlayer.playbackRate = 0.25;

  quickSFX("gameover");
};


function qData(qInd) {
  let qData = questions[qInd];
  let currQ = qData.question;
  let currAnsSet =   qData.answers;
  let currRepSet =   qData.replies; 
  let currAngSet =   qData.anger;
  let currCorrAns =  qData.correctAnswer;
  let sus =          qData.suspense;
  let timeLim =      qData.timeLim;
  return [currQ, currAnsSet, currRepSet, currAngSet, currCorrAns, sus, timeLim]
}

//for sounds that play in quick succession and can't use an existing player
function quickSFX(buffer,rate=1) {
  if (!sfxPlayer.mute) {
    let sound = new Tone.Player(sfx.get(buffer)).toDestination();
    sound.volume.value = sfxVol;
    sound.playbackRate = rate
    sound.start();
    sound.onstop = () => sound.dispose();
  }
}

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
