$(function() {
  $("#start-button").click(function(){
    toQuizPage()
    startQuiz()
    console.log("Quiz started.")
  })
})

function startQuiz() {
  $(".quiz-intro").animate({left: "500px", opacity: "0"})
  $(".quiz-intro").hide(2000)
}

function toQuizPage() {
  $(location).attr("href", "../quiz/index.html")
}

setTimeout(toQuizPage, 5000)
