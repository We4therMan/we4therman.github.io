$(function() {
  $("#startButton").on("click", function() {
    console.log("start button pressed");
    $("#startButton").hide();
    initQuiz();
  })
})

const specialKeys = ['burgerAnswer', 'cumAnswer']

var currentQInd = 0;
var currQuestion = "";
var currAnsSet = "";
var currAngSet = "";
var currRepSet = "";
var currBurgAns = "";
var currCumAns = "";
var correctAnswers = [];

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
  $("#quizContainer").append(`<button class='multChoice'>${test}</button>`)
  $("#quizContainer").append(`<button class='multChoice'>${test}, ${test}, ${test}</button>`)
  $("#quizContainer").append(`<button class='multChoice'>${test}</button>`)
  $("#quizContainer").append(`<button class='multChoice'>${test}</button>`)
  loadQuestion(currentQInd);
}

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  console.log(`initializing question ${currentQInd+1}`)
  $("#quizContainer").append("if you see this text the quiz broke :(");
  $("#quizContainer").empty();
  currQuestion = questions[currentQInd]["question"]; //question
  currAnsSet = questions[currentQInd]["answers"]; //answers
  currAngSet = questions[currentQInd]["anger"];
  currRepSet = questions[currentQInd]["replies"];
  currCorrAns = questions[currentQInd]["correctAnswer"]

  currAnsSet.forEach((currAns,ansInd) => {
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currAngSet[ansInd] //replies
    
    if (currCorrAns.includes(ansInd)){
      isCorrect = true;
    } else {
      isCorrect = false;
    };

    resetSpecials();
    var currSpecKeys = Object.keys(checkGetSpecial(currentQInd,specialKeys))
    var currSpecAnsInd = Object.values(checkGetSpecial(currentQInd,specialKeys))
    setSpecials(currentQInd,currSpecKeys);

    $quizCon

  $("#question").text(currQuestion)
    

  });

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
    console.log("special keys reset")
    console.log(specialKeys)
  });
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

function generateAns(isCorrect,ans,rep){
  var r = $('<input />').attr({
    type: "button", 
    class: "multChoice",
    value: ans,
    onclick: result(isCorrect)
  });
  return r;
}

//TEST CODE HERE IF U NEED

var specialAnsSet = Object.entries(checkGetSpecial(4,specialKeys))
console.log('HELLO I AM HERE');
console.log(specialAnsSet);

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
