$(function() {
  $("#startButton").on("click", function() {
    console.log("start button pressed");
    $("#startButton").hide();
    initQuiz();
  })
})

const specialKeys = [
  {
    'burgerAnswer': false, 
    'cumAnswer': false

  }
]

var currentQInd = 0;
var currQuestion = "";
var currAnsSet = "";
var currAngSet = "";
var currRepSet = "";
var currBurgAns = "";
var currCumAns = "";
var correctAnswers = [];

var correctScore = 0
var angScore = 0

var isCorrect = false;
var giveBurger = false;
var saidCum = false;

function correctAnswer() {
  answer = true;
  $(".blackground").css("background-color", "green");
  $(".correctText").show();
}

const test = "this is a really long test. SO long in fact, that I made it a separate variabble"

function initQuiz() {
  console.log("Initializing quiz");
  correctAnswers = 0;
  currentQInd = 0;
  $("#quizContainer").show();
  resetSpecials();
  loadQuestion(currentQInd);
}

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  console.log(`initializing question ${currentQInd+1}`)
  // $("#quizContainer").append("if you see this text the quiz broke :(");
  // $("#quizContainer").empty();
  currQuestion = questions[currentQInd]["question"]; //question
  currAnsSet = questions[currentQInd]["answers"]; //answers
  currAngSet = questions[currentQInd]["anger"];
  currRepSet = questions[currentQInd]["replies"];
  currCorrAns = questions[currentQInd]["correctAnswer"]
  console.log(currQuestion)

  currAnsSet.forEach((currAns,ansInd) => {
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currRepSet[ansInd] //replies
    console.log(`loadquestion curr ans "${currAns}" curr ang ${currAng} curr reply "${currRep}"`);
    
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
  console.log("genius")
  angScore += ang;
  if (isCorrect === true) {
    correctScore++;
  } else {
    //wrong answer event
  }
  $("#result").text(rep)
  console.log(angScore);
  console.log(correctScore);
  checkAnger(angScore);
}

function checkAnger(ang) {
  switch (true) {
    case ang < -100:
      console.log("happy stage2");
      break;
    case ang >= -100 && ang < -50:
      console.log("happy stage1");
      break;
    case ang >= -50 && ang <= 50:
      console.log("neutral");
      break;
    case ang > 50 && ang <= 100:
      console.log("angry stage 1");
      break;
    case ang > 100 && ang < 150:
      console.log("angry stage2");
      break;
    case ang >= 150:
      console.log("anger final");
      break;
  }
  
};
//TEST CODE HERE IF U NEED

var specialAnsSet = Object.entries(checkGetSpecial(4,specialKeys))
console.log('HELLO I AM HERE');
console.log(specialAnsSet);

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
