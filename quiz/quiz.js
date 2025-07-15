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

var correctAnswers = 0;
var currentQuestion = 0;


function correctAnswer() {
  answer = true;
  $(".blackground").css("background-color", "gray");
  $(".correctText").show();
}

function initQuiz() {
  correctAnswers = 0
  $("#quizContainer").show();
  $("#quizContainer").append("<p>ok let's go</p>");
}

function loadQuestion(qInd){
  $("#quizContainer").append("hold on a second")
}

console.log()


console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
