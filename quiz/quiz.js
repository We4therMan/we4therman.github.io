$.getScript("questions.js", function(){
  console.log("fetching questinos data..");
  console.log(questions[0]);
  console.log("question data fetched..");
})

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

var isCorrect = false;
var giveBurger = false;
var saidCum = false;

function correctAnswer() {
  answer = true;
  $(".blackground").css("background-color", "gray");
  $(".correctText").show();
}

const test = "this is a really long test. SO long in fact, that I made it a separate variabble"

function initQuiz() {
  console.log("Initializing quiz");
  correctAnswers = 0;
  currentQInd = 0;
  $("#quizContainer").show();
  $("#quizContainer").append("<p>ok let's go</p>");
  $("#quizContainer").append(`<button class='multChoice'>${test}</button>`)
  $("#quizContainer").append("<button class='multChoice'>test2 2 2 2 </button>")
  $("#quizContainer").append("<button class='multChoice'>test3</button>")
  $("#quizContainer").append("<button class='multChoice'>test4</button>")
  setTimeout(() => {
    console.log("waiting")
  }, 2000);
  loadQuestion(currentQInd);
}

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  $("#quizContainer").append("hold on a second");
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
    setSpecials(currSpecKeys);
    // switch (currSpecKeys) {
    //   case "burgerAnswer":
    //     giveBurger = true;
    //     currBurgAns = questions[currentQInd]["burgerAnswer"]
    //   case "cumAnswer":
    //     saidCum = true;
    //     currCumAns = questions[currentQInd]["cumAnswer"]
    //   default:
    //     console.log("question has no special events")
    // }

    $("#quizContainer").append("")
    

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

function setSpecials(keys){
  switch (keys) {
      case "burgerAnswer":
        giveBurger = true;
        currBurgAns = questions[currentQInd]["burgerAnswer"];
      case "cumAnswer":
        saidCum = true;
        currCumAns = questions[currentQInd]["cumAnswer"];
      default:
        console.log("question has no special events");
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

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
