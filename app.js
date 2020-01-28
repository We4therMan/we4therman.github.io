$(function() {
  $("#darkMode").click(function(){
    darkMode = !darkMode
    refreshColors()
    count++
    console.log(count)
    easterEgg()
  })

})

var darkMode = false

var count = 0

function refreshColors() {
  if (darkMode == true) {
    $(".background").css({"background": "none", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.1)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.1)"})
    $("#darkMode").css({"background-color": "black", "color": "white"})
    $("#darkMode span").text("Light Mode")
  } else {
    $(".background").css({"background": "url('https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg') ", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.6)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.25)"})
    $("#darkMode").css({"background-color": "rgba(255,0,0,0.5)", "color": "white"})
    $("#darkMode span").text("Dark Mode")
  }
}

function easterEgg() {
  if (count == 69) {
    $("#easterEgg").html("Good job! You found the third secret added to this website.<br><br>Secret 3: ")
  } else if (count >= 90) {
    $("#easterEgg").html("You've reached my website. For now, this place is an empty desolate land that only allows you to stare at text endlessly as you await for secrets to be revealed. <i>It seems like you've already revealed this secret though, good job!</i>")
  } else if (count >= 110) {
    $("#easterEgg").html("You can stop clicking now, that was the only secret here...")
  } else if (count >= 130) {
    $("#easterEgg").html("I'm not lying, that was the only secret, go look elsewhere.")
  } else if (count >= 150) {
    $("#easterEgg").html("You can't possibly like pressing the button <i>that</i> much...")
  } else if (count >= 170) {
    $("#easterEgg").html("You can't be trusted with the dark mode button, I'll just remove it.")
    $("#darkMode").hide
  }
}

//To-do, use switch instead of if else statements to fix the easter egg messages.
