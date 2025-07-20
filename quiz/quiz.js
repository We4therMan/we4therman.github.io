$(function() {
  $("#startButton").on("click", function() {
    console.log("start button pressed");
    $("#startButton").hide();
    initQuiz();
  })
  $("#nextButton").on("click", function(){
    console.log("next button pressed")
    nextEvent(); //todo: handle when it needs to confirm if no answer is selected, text is still scrolling, or if we are at an interlude
  })
})

const specialKeys = [
  {
    'burgerAnswer': false, 
    'cumAnswer': false
  }
]

//question variables
var currentQInd = 0;
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

//route variables
var giveBurger = false;
var saidCum = false;

//UI variables
var eventType = "intro";

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
  currQuestion = questions[currentQInd]["question"]; //question
  currAnsSet = questions[currentQInd]["answers"]; //answers
  currAngSet = questions[currentQInd]["anger"];
  currRepSet = questions[currentQInd]["replies"];
  currCorrAns = questions[currentQInd]["correctAnswer"];
  console.log(currQuestion)

  currAnsSet.forEach((currAns,ansInd) => {
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currRepSet[ansInd] //replies
    console.log(`loadquestion curr ans "${currAns}" curr ang ${currAng} curr reply "${currRep}" correct answer indeces ${currCorrAns}`);
    
    if (currCorrAns.includes(ansInd)){
      isCorrect = true;
    } else {
      isCorrect = false;
    };
    
    console.log(`iscorrect ${isCorrect}`);
    // $("#quizContainer").append(`<button class="multChoice">${currAns}</button>`)
    generateAns(isCorrect,currAns,currAng,currRep);
  });

  let currSpecKeys = Object.keys(checkGetSpecial(currentQInd,specialKeys))
  let currSpecAnsInd = Object.values(checkGetSpecial(currentQInd,specialKeys))
  setSpecials(currentQInd,currSpecKeys);

  $("#question").text(currQuestion)

}

function checkGetSpecial(ind,spKeys){
  return spKeys
    .filter(spKey => questions[ind].hasOwnProperty(spKey))
    .reduce((result, spKey) => {
      result[spKey] = questions[ind][spKey];
      return result;
    }, {});
}

function resetSpecials(){
  specialKeys.forEach((key,ind) => {
    specialKeys[ind] = false;
    console.log(specialKeys)
  });
  console.log("special keys reset")
}

function setSpecials(qInd,keys){
  switch (keys) {
      case "burgerAnswer":
        giveBurger = true;
        currBurgAns = questions[currentQInd]["burgerAnswer"];
      case "cumAnswer":
        saidCum = true;
        currCumAns = questions[currentQInd]["cumAnswer"];
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

function result(isCorrect,ang,rep) {
  angScore += ang;
  if (isCorrect) {
    correctScore++;
    console.log("pulsing green")
    pulseBG("#3eff35");
  } else {
    console.log("pulsing red");
    pulseBG("#fa2323");
  }
  $("#result").text(rep)
  console.log(angScore);
  console.log(correctScore);
  checkAnger(angScore);
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
      // console.log("neutral");
      angStage = 0
      break;
    case ang > 50 && ang <= 100:
      // console.log("angry stage 1");
      angStage = 1
      break;
    case ang > 100 && ang < 150:
      // console.log("angry stage2");
      angStage = -2
      break;
    case ang >= 150:
      // console.log("anger final");
      angStage = -3
      break;
  }
  
};

function nextEvent() {
  e = questions[currentQInd]["nextEvent"]
  if (!e) {
    currentQInd++;
    loadQuestion(currentQInd);
  } else if (e === "interlude") {
    console.log("start interlude")
  }

}
//TEST CODE HERE IF U NEED

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
