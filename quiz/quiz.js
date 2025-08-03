//TODO maybe move audio setup to another js file? probably don't need em here
// const correctSnd = new Audio('quiz-aud/snd_correct.ogg');
// const wrongSnd = new Audio('aud/snd_wrong.ogg');
// const tic = new Audio('aud/snd_tic.ogg')
// const ambSnd = new Audio('snd/snd_ambivalent.ogg') //TODO make this sound
// const pitchShift = new Tone.PitchShift();
// var bgMusic = new Tone.Player('aud/mus_thefirstfew_0.ogg').toDestination();
// bgMusic.connect(pitchShift);
// bgMusic.loop = true;

//sound variables
const mus = new Tone.ToneAudioBuffers({
  urls: {
    firstfew: "aud/mus_thefirstfew_0.ogg",
    //interlude: "aud/mus_interlude.ogg", //TODO write this song lol
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
    gameover: "aud/snd_gameover.ogg"
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
var currentQInd;
var currentIntInd;
var currQuestion;
var currAnsSet;
var currAngSet;
var currRepSet;
var currCorrAns = [];
var currBurgAns;
var currCumAns;
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
var eventType = "intro";
var ticRate = 200;
var buttonAnsTimer;
var speedUp = false;

$(function() {
  $("#startButton").on("click", async function() {
    console.log("start button pressed");

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
  eventType = "question"
}

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  console.log(`initializing question ${currentQInd+1}`);
  $("#quizContainer, #result").show();
  $("#quizContainer, #result").empty();
  $("#nextButton, #contButton, #intContainer").hide();
  currQuestion = questions[currentQInd].question; //question
  currAnsSet = questions[currentQInd].answers;
  currAngSet = questions[currentQInd].anger;
  currRepSet = questions[currentQInd].replies; 
  currCorrAns = questions[currentQInd].correctAnswer;
  sus = questions[currentQInd].suspense //suspense value
  ticRate = (sus) ? 800 : 200;
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

  $("#question").html(`${(currentQInd + 1).toString()}. ${currQuestion}`).css({"color": "white"});
};

//save texts to be displayed in an array to be shown
// function selectedTexts(currentIntInd, failing, angStage) {
//   const intSet = interludes[currentIntInd];
//   return [
//     failing ? intSet.restTxtFail : intSet.restTxtReg,
//     burgerOn ? intSet.burgerTxt : null,
//     cumOn ? intSet.cumTxt : null,
//     angStage >= 1 ? intSet.angryTxt : null,
//     angStage >= 1 ? intSet.readyTxtAng : intSet.readyTxtReg
//   ].filter(item => typeof item === 'string');
// };

//FININSH THIS AND MAKE IT BETTER
function selectTexts(ind) {
  console.log("serious brainfart moment")
  let fail = failing, angry = (angStage > 0), burger = burgerOn, cum = cumOn; //update variables for state
  let states = {fail, angry, burger, cum} //all possible selectors as simple boolean states (update as more are added)
  const intSet = interludes[ind];

  let restKey = Object.keys(intSet.restTxts).find(key => key !== 'reg' && states[key]) || 'reg';
  let restTxt = intSet.restTxts[restKey]

  let readyKey = Object.keys(intSet.readyTxts).find(key => key !== 'reg' && states[key]) || 'reg';
  let readyTxt = intSet.readyTxts[readyKey]

  let specialTxts = Object.keys(intSet.specialTxts)
    .filter(key => states[key])
    .map(key => interludes.specialTxts[key])

  return [restTxt, specialTxts, readyTxt].flat().filter(Boolean);
};

// function selectInterlude(interlude, state) {
//     // Find the first non-'reg' key in restTxts where the selector is true, else fallback to 'reg'
//     let restKey = Object.keys(interlude.restTxts).find(key => key !== 'reg' && state[key]) || 'reg';
//     let restTxt = interlude.restTxts[restKey];

//     // Same logic for readyTxts
//     let readyKey = Object.keys(interlude.readyTxts).find(key => key !== 'reg' && state[key]) || 'reg';
//     let readyTxt = interlude.readyTxts[readyKey];

//     // For specialTxts, include all matching keys (multiple allowed)
//     let specialTxts = Object.keys(interlude.specialTxts)
//         .filter(key => state[key])
//         .map(key => interlude.specialTxts[key]);

//     return { restTxt, readyTxt, specialTxts };
// }

function loadInterlude(currentIntInd) {
  $("#quizContainer, #intContainer, #question, #result").empty();
  $("#quizContainer, #nextButton").hide();
  $("#intContainer").show();
  sfxPlayer.buffer = sfx.get("blip");

  failing = (correctScore/currentQInd < 0.5) ? true : false;

  let intTxts = selectTexts(currentIntInd)
  console.log(intTxts)

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

  $("quizContainer").text("if you see this text something is not working");
};

//
function checkGetSpecial(ind,spKeys){
  console.log("checking specials");
  return spKeys
    .filter(spKey => questions[ind].hasOwnProperty(spKey)) //make a new array of only the present keys
    .reduce((result, spKey) => {
      result[spKey] = questions[ind][spKey];
      console.log(result)
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
  console.log(`${specil}, ${isSpecil}`)

  var button = $('<button />') 
    .addClass("multChoice")
    .text(ans)
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
  console.log("generating text");

  var t = $('<p />')
  .addClass("intTxt")
  .html(txt);

  $("#intContainer").append(t);
  // $("#intContainer").append("<br>")
};

//handle answer choice
function result(isCorrect,ang,rep) {
  angScore += ang;
  if (isCorrect) {
    correctScore++;
    console.log("pulsing green");
    pulseBG("#007d00");
  } else {
    console.log("pulsing red");
    pulseBG("#7d0400");
  }
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
  console.log(angScore, correctScore);
  checkAnger(angScore);
  console.log(`anger stage ${angStage}`)
  musPlayer.playbackRate = 1.0
  $("#nextButton").show();

  if (angStage === 3) {gameOver()};
}

function pulseBG(color) {
  const bg = $(".background")
  bg.css({"transition": "none", "background-color": color})
  setTimeout(() => {
    bg.css({"transition": "background-color 2s ease", "background-color": "black"})
  }, 5);
}

function checkAnger(ang) {
  switch (true) {
    case ang < -100:
      // console.log("happy stage2");
      angStage = -2
      break;
    case ang >= -100 && ang < -50:
      // console.log("happy stage1");
      angStage = -1
      break;
    case ang >= -50 && ang <= 50:
      // console.log("neutral (stage 0)");
      angStage = 0
      break;
    case ang > 50 && ang <= 100:
      // console.log("angry stage 1");
      angStage = 1
      break;
    case ang > 100 && ang < 150:
      // console.log("angry stage2");
      angStage = 2
      break;
    case ang >= 150:
      // console.log("anger final");
      angStage = 3
      break;
  }
};

//if there's no nextEvent label, next event is assumed to be a question (interludes have no label)
function nextEvent() {
  let ne = questions[currentQInd].nextEvent //check nextEvent label
  if (!ne) {
    currentQInd++;
    console.log(`q index increased to ${currentQInd}`)
    loadQuestion(currentQInd)
  } else if (ne === "interlude") {
    loadInterlude();
  }
  console.log(`currecntQInd: ${currentQInd}`)
}

function gameOver() {
  $("#question").text("GAME OVER").css({"color": "red", "font-size": "76px"});
  $("result").css({"color": "red"});
  $("#nextButton").off("click").on("click", function(){
    initQuiz()
  }).text("START OVER");
  musPlayer.playbackRate = 0.25;

  if (!sfxPlayer.mute) {
        //must be a new player as question result sound also plays during gameOver
        lose = new Tone.Player(sfx.get("gameover")).toDestination();
        lose.volume.value = sfxVol;
        lose.start();
        lose.onstop = () => lose.dispose();
      }
}
//TEST CODE HERE IF U NEED

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
