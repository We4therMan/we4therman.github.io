//sound variables
const mus = new Tone.ToneAudioBuffers({
  urls: {
    firstfew: "aud/mus_thefirstfew_0.ogg",
    firstfew_w: "aud/mus_thefirstfew_w.ogg",
    //interlude: "aud/mus_interlude.ogg", //TODO write this song lol
    jonas: "aud/mus_jonas.ogg",
  },
  onload: () => {
    console.log("music buffers loaded")
  }
});

const sfx = new Tone.ToneAudioBuffers({
  urls: {
    wrong: "aud/snd_wrong.ogg",
    correct: "aud/snd_correct.ogg",
    tic: "aud/snd_tic.ogg",
    blip: "aud/snd_blip.ogg",
    gameover: "aud/snd_gameover.ogg",
    jonas: "aud/snd_jonas.ogg"
  },
  onload: () => {
    console.log("sfx buffers loaded")
  }
});

let musPlayer;
let sfxPlayer;
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

//route variables
var burgerOn = false;
var cumOn = false;
//'-Ans' names of special answers in questions.js
const specialKeys = ['burgerAns', 'cumAns'];

//UI variables
var ce = "intro"; //defines current event; MUST MATCH quiz-data ARRAY NAMES (i.e. 'questions' with an s)
var ticRate = 200;
var buttonAnsTimer;
var speedUp = false;

$(function() {
  $("#startButton").on("click", async function() {
    await Tone.start();
    musPlayer = new Tone.Player().toDestination();
    musPlayer.buffer = mus.get("firstfew");
    musPlayer.loop = true;
    musPlayer.volume.value = musVol;
    musPlayer.start();
    console.log("Music started")

    sfxPlayer = new Tone.Player().toDestination();
    sfxPlayer.volume.value = sfxVol;
    console.log("SFX player initialized")

    $("#startButton").hide();

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
  correctAnswers = 0, currentQInd = 0, currentIntInd = 0, angScore = 0;
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
  console.log(`initializing question ${currentQInd+1}`);
  ce = "questions"
  $("#quizContainer, #result").show();
  $("#quizContainer, #result").empty();
  $("#nextButton, #contButton, #intContainer").hide();
  //load in question data
  let qData = questions[currentQInd];
  let currQuestion = qData.question;
  let currAnsSet =   qData.answers;
  let currAngSet =   qData.anger;
  let currRepSet =   qData.replies; 
  let currCorrAns =  qData.correctAnswer;
  let sus =          qData.suspense
  window[qData.callSpec]?.(); //call special event function if qData has one
  ticRate = (sus) ? 800 : 200; //slow tics for high suspense
  sfxPlayer.buffer = sfx.get("tic"); //load tic to player

  let specil = checkGetSpecial(currentQInd, specialKeys);
  let specilKs = Object.keys(specil), specilIs = Object.values(specil);

  currAnsSet.forEach((currAns,ansInd) => { //answer options and indices
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currRepSet[ansInd] //replies
    //console.log(`loadquestion curr ans "${currAns}" curr ang ${currAng} curr reply "${currRep}" correct answer indeces ${currCorrAns}`);
    let isCorrect = currCorrAns.includes(ansInd), isSpecil = specilIs.includes(ansInd); //mark ans if correct/special
    let specilK = specilKs.find(k => specil[k] === ansInd); //find matching special (can handle multiple specials in one question)

    buttonAnsTimer = setTimeout(() => {
      generateAns(isCorrect, currAns, currAng, currRep, specilK, isSpecil);
      sfxPlayer.start(); //play tic
    }, (speedUp ? ((ansInd + 1) * 50) : ((ansInd + 1) * ticRate))); //todo: make timeout 0 if skip option is true
  });

  musPlayer.playbackRate = sus ? 0.90 : 1.0

  $("#question")
    .html(`${(currentQInd + 1).toString()}. ${currQuestion}`)
    .css({"color": "white", "font-size": "48px"});
};

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
  burgerOn = false, cumOn = false;
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

function generateAns(isCorrect,ans,ang,rep,specil,isSpecil){
  var button = $('<button />') 
    .addClass("multChoice")
    .html(ans)
    .data({isCorrect,ang,rep,specil})
    .on("click", function(){
      let data = $(this).data();
      result(data.isCorrect,data.ang,data.rep);
      if (isSpecil) {
        setSpecials(specil);
      }
    });

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
  angScore += ang;
  pulseBG(isCorrect ? "#007d00" : "#7d0400");
  if (isCorrect) correctScore++;
  sfxPlayer.buffer = sfx.get(isCorrect ? "correct" : "wrong");
  sfxPlayer.start();

  $("#result").text(rep)
  let ansClicks = 1;
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
        $("#question").text("you're really fucking annoying, you know that?");
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
  console.log(`anger stage ${angStage}`)
  musPlayer.playbackRate = 1.0
  $("#nextButton").show();

  if (angStage === 3) {gameOver()};
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

function nextEvent() {
  let evInd = indOf[ce]?.(); //select index of current event
  let ne = quiz[ce][evInd].nextEvent //check if ce has nextEvent label and store it
  console.log("NEXT EVENT DATA",ce,currentQInd,currentIntInd,ne)

  if (!ne) return loadQuestion(++currentQInd); //if no label, update index and load next question
  if (ne === "interlude") return loadInterlude(currentIntInd++); //if interlude, load interlude and update index
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

//for sounds that play in quick succession and can't use an existing player well
function quickSFX(buffer) {
  if (!sfxPlayer.mute) {
    let sound = new Tone.Player(sfx.get(buffer)).toDestination();
    sound.volume.value = sfxVol;
    sound.start();
    sound.onstop = () => sound.dispose();
  }
}

//TEST CODE HERE IF U NEED

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
