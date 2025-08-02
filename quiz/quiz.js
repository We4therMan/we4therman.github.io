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
var giveBurger = false;
var saidCum = false;
const specialKeys = [ //add future keys to this
  {
    'burgerAnswer': false, 
    'cumAnswer': false
  }
];

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
  $(".quizWelcome").hide();
  $("#quizContainer").show();
  //reassign button function
  $("#nextButton").off("click").on("click", function(){
    clearTimeout(buttonAnsTimer);
    nextEvent(); 
  }).text("Next");
  resetSpecials();
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
  console.log(currQuestion)
  sus = questions[currentQInd].suspense //suspense value
  ticRate = (sus) ? 800 : 200;

  currAnsSet.forEach((currAns,ansInd) => { //answer options and indices
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currRepSet[ansInd] //replies
    console.log(`loadquestion curr ans "${currAns}" curr ang ${currAng} curr reply "${currRep}" correct answer indeces ${currCorrAns}`);
    let isCorrect = currCorrAns.includes(ansInd);
    
    buttonAnsTimer = setTimeout(() => {
      generateAns(isCorrect, currAns, currAng, currRep);
      if (!sfxPlayer.mute) { //play tic if sfx is on
        tic = new Tone.Player(sfx.get("tic")).toDestination();
        tic.volume.value = sfxVol;
        tic.start();
        tic.onstop = () => tic.dispose();
      }
    }, (speedUp ? ((ansInd + 1) * 50) : ((ansInd + 1) * ticRate))); //todo: make timeout 0 if skip option is true
  });

  musPlayer.playbackRate = sus ? 0.90 : 1.0

  let currSpecKeys = Object.keys(checkGetSpecial(currentQInd,specialKeys))
  let currSpecAnsInd = Object.values(checkGetSpecial(currentQInd,specialKeys))
  setSpecials(currentQInd,currSpecKeys);

  $("#question").html(`${(currentQInd + 1).toString()}. ${currQuestion}`).css({"color": "white"});
};

//save texts to be displayed in an array to be shown
function selectedTexts(currentIntInd, failing, angStage) {
  const intSet = interludes[currentIntInd];
  return [
    failing ? intSet.restTxtFail : intSet.restTxtReg,
    giveBurger ? intSet.burgerTxt : null,
    saidCum ? intSet.cumTxt : null,
    angStage >= 1 ? intSet.angryTxt : null,
    angStage >= 1 ? intSet.readyTxtAng : intSet.readyTxtReg
  ].filter(item => typeof item === 'string');
};

function loadInterlude(currentIntInd) {
  $("#quizContainer, #intContainer, #question, #result").empty();
  $("#quizContainer, #nextButton").hide();
  $("#intContainer").show();
  sfxPlayer.buffer = sfx.get("blip")

  failing = (correctScore/currentQInd < 0.5) ? true : false;

  let intTexts = selectedTexts(currentIntInd,failing,angStage)

  setTimeout(() => {
    console.log("playing")
    $("#contButton").show();
    sfxPlayer.start();
  }, (intTexts.length) * 1000);

  intTexts.forEach((intTxt,txtInd) => {
    var intTimer = setTimeout(() => {
      console.log("playing")
      generateIntTxt(intTxt);
      sfxPlayer.start();
    }, txtInd * 1000);
  })

  $("quizContainer").text("if you see this text something is not working");
};

function checkGetSpecial(ind,spKeys){
  return spKeys
    .filter(spKey => questions[ind].hasOwnProperty(spKey))
    .reduce((result, spKey) => {
      result[spKey] = questions[ind][spKey];
      return result;
    }, {});
};

function resetSpecials(){
  specialKeys.forEach((key,ind) => {
    specialKeys[ind] = false;
    console.log(specialKeys)
  });
  console.log("special keys reset")
}

function setSpecials(qInd,keys){ //add future routes to this. The rest should handle itself
  switch (keys) {
      case "burgerAnswer":
        giveBurger = true;
        currBurgAns = questions[currentQInd].burgerAnswer;
      case "cumAnswer":
        saidCum = true;
        currCumAns = questions[currentQInd].cumAnswer;
      default:
        console.log(`question ${qInd+1} has no special events`);
    }
}

function generateAns(isCorrect,ans,ang,rep){
  console.log("generating answer button");

  var button = $('<button />') 
    .addClass("multChoice")
    .text(ans)
    .data({isCorrect,ang,rep})
    .on("click", function(){
      let data = $(this).data();
      result(data.isCorrect,data.ang,data.rep);
    });

  $("#quizContainer").append(button);
}

function generateIntTxt(txt) {
  console.log("generating text");

  var t = $('<p />')
  .addClass("intTxt")
  .html(txt);

  $("#intContainer").append(t);
  $("#intContainer").append("<br>")
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
        $("#question").text("OK, I don't know what you're trying to achieve here. DON'T DO IT AGAIN.");
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

function nextEvent() {
  currentQInd++;
  let ne = questions[currentQInd].nextEvent //check nextEvent label
  if (!ne) {
    //if there's no label, next event is assumed to be a question
    //interludes have no label, so next event is also assumed to be a question
    loadQuestion(currentQInd);
  } else if (ne === "interlude") {
    loadInterlude(currentIntInd);
  }
}

function gameOver() {
  $("#question").text("GAME OVER").css({"color": "red", "font-size": "76px"});
  $("result").css({"color": "red"});
  $("#nextButton").off("click").on("click", function(){
    initQuiz()
  }).text("START OVER");
  musPlayer.playbackRate = 0.25;
}
//TEST CODE HERE IF U NEED

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
