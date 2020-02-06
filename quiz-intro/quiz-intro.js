$(function() {
  $("#start-button").click(function(){
    startQuiz()
    console.log("Quiz started.")
  })
})

function startQuiz() {
  $(".quiz-intro").animate({left: "500px", opacity: "0"})
  $(".background").animate({opacity: "0"})
  $(location).attr("href", "../quiz/index.html")
}
