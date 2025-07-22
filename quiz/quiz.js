//TODO maybe move audio setup to another js file? probably don't need em here
const correctSnd = new Audio('quiz-aud/snd_correct.ogg');
const wrongSnd = new Audio('quiz-aud/snd_wrong.ogg');
const tic = new Audio('quiz-aud/snd_tic.ogg')
// const ambSnd = new Audio('quiz-snd/snd_ambivalent.ogg') //TODO make this sound
const pitchShift = new Tone.PitchShift();
var bgMusic = new Tone.Player('quiz-aud/mus_thefirstfew_0.ogg').toDestination();
bgMusic.connect(pitchShift);
bgMusic.loop = true;

//question variables
var currentQInd = 0;
var currentIntInd = 0;
var currQuestion = "";
var currAnsSet = "";
var currAngSet = "";
var currRepSet = "";
var currCorrAns = [];
var currBurgAns = "";
var currCumAns = "";
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
var buttonTimer;
var speedUp = false;

$(function() {
  $("#startButton").on("click", function() {
    console.log("start button pressed");
    bgMusic.start();
    $("#startButton").hide();
    initQuiz();
  });
  $("#nextButton").on("click", function(){
    clearTimeout(buttonTimer);
    console.log("next button pressed")
    nextEvent(); //todo: handle when it needs to confirm if no answer is selected, text is still scrolling, or if we are at an interlude
  });
  $("#musVolume").on("input", function() {
    bgMusic.volume.value = parseFloat(this.value);
    bgMusic.mute = (this.value <= -30.0) ? true : false;
  })
})

function initQuiz() {
  console.log("Initializing quiz");
  correctAnswers = 0;
  currentQInd = 0;
  $(".quizWelcome").hide();
  $("#quizContainer").show();
  resetSpecials();
  loadQuestion(currentQInd);
  eventType = "question"
}

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  console.log(`initializing question ${currentQInd+1}`);
  $("#result").empty();
  $("#nextButton").hide();
  $("#quizContainer").empty();
  currQuestion = questions[currentQInd].question; //question
  currAnsSet = questions[currentQInd].answers;
  currAngSet = questions[currentQInd].anger;
  currRepSet = questions[currentQInd].replies; 
  currCorrAns = questions[currentQInd].correctAnswer;
  console.log(currQuestion)
  sus = questions[currentQInd].suspense //suspense value
  ticRate = (sus) ? 1000 : 200;

  currAnsSet.forEach((currAns,ansInd) => { //answer options and indices
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currRepSet[ansInd] //replies
    console.log(`loadquestion curr ans "${currAns}" curr ang ${currAng} curr reply "${currRep}" correct answer indeces ${currCorrAns}`);
    let isCorrect = currCorrAns.includes(ansInd);
    
    var buttonTimer = setTimeout(() => {
      generateAns(isCorrect, currAns, currAng, currRep);
      new Audio('quiz-aud/snd_tic.ogg').play();
    }, (speedUp ? ((ansInd + 1) * 50) : ((ansInd + 1) * ticRate))); //todo: make timeout 0 if skip option is true
  });

  bgMusic.playbackRate = sus ? 0.90 : 1.0;

  let currSpecKeys = Object.keys(checkGetSpecial(currentQInd,specialKeys))
  let currSpecAnsInd = Object.values(checkGetSpecial(currentQInd,specialKeys))
  setSpecials(currentQInd,currSpecKeys);

  $("#question").text(currQuestion)

};

function loadInterlude(currentIntInd) {
  console.log("deep voice male");
  $("#result").empty();
  $("#quizContainer").empty();
  $("#question").empty();
  $("#nextButton").hide();

  failing = (correctScore/currentQInd < 0.5) ? true : false;

  selectedTexts(currentIntInd,failing,angStage).forEach((intTxt,txtInd) => {
    var intTimer = setTimeout(() => {
      generateIntTxt(intTxt);
      new Audio('quiz-aud/snd_tic.ogg').play();
    }, 500)
  })

  $("quizContainer").text("test for now hello me");
};

//save texts to be displayed in an array to be shown
function selectedTexts(intInd, failing, angStage) {
  const intSet = interludes[intInd];
  console.log(intSet);
  return [
    failing ? intSet.restTxtFail : intSet.restTxtPass,
    giveBurger ? intSet.burgerTxt : null,
    saidCum ? intSet.cumTxt : null,
    angStage >= 1 ? intSet.angryTxt : null,
    angStage >= 1 ? intSet.readyTxtAng : intSet.readyTxtReg
  ].filter(item => typeof item === 'string');
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
  .text(txt);

  $("#quizContainer").append(t);
};

function result(isCorrect,ang,rep) {
  angScore += ang;
  if (isCorrect) {
    correctScore++;
    console.log("pulsing green");
    pulseBG("#3eff35");
    new Audio('quiz-aud/snd_correct.ogg').play();
  } else {
    console.log("pulsing red");
    pulseBG("#fa2323");
    new Audio('quiz-aud/snd_wrong.ogg').play();
  }
  $("#result").text(rep)
  console.log(angScore);
  console.log(correctScore);
  checkAnger(angScore);
  bgMusic.playbackRate = 1.0
  $("#nextButton").show();
}

function pulseBG(color) {
  const bg = $(".background")
  bg.css("transition", "none")
  bg.css("background-color", color);
  setTimeout(() => {
    bg.css("transition", "background-color 2s ease")
    bg.css("background-color", "black")
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
  e = questions[currentQInd].nextEvent //check nextEvent label
  if (!e) {
    //if no label, next event is assumed to be a question
    currentQInd++;
    loadQuestion(currentQInd);
  } else if (e === "interlude") {
    loadInterlude();
  }

}
//TEST CODE HERE IF U NEED

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
