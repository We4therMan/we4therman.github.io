$(function() {
  $("#start-button").click(function(){
    toQuizPage()
    startQuiz()
    console.log("Quiz started.")
  })

  $(document).on("keydown", (e) => {
    if (e.code === "KeyK") {
      toQuizPage();
    }
  })
})

function startQuiz() {
  $(".quiz-intro").animate({left: "500px", opacity: "0"})
  $(".quiz-intro").hide(2000)
}

function toQuizPage() {
  $(location).attr("href", "../quizunderconstruction")
}

// setTimeout(toQuizPage, 5000)

