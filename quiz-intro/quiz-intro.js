$(function() {
  $("#start-button").click(function(){
    startQuiz()
    console.log("Quiz started.")
  })
})

console.log("This is a test of my quiz.js file. This file needs to somehow be kept secret because it contains all the answers to quiz questions, and could potentially ruin the quiz experience for some.")

function startQuiz() {
  $(".quiz-intro").animate({left: "500px", opacity: "0"})
  $(".background").animate({opacity: "0"})
  $(location).setTimeout(1000).attr("href", "../quiz/index.html")
}
