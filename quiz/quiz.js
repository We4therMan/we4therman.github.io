$(function() {
  $("#correctText").hide

  $(".quizAns").click(function(){
    incorrectAnswer()
    console.log(answer)
  })

  $("#ans1").click(function(){
    correctAnswer()
    console.log(answer)
  })
})

var answer = false
var lives = 3


function correctAnswer() {
  answer = true
  $(".blackground").css("background-color", "gray")
  $(".correctText").show
}


console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
