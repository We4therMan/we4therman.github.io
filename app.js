$(function() {
  $("#darkMode").click(function(){
    darkMode = !darkMode
    refreshColors()
  })

  $.getJSON( "https://pointercrate.com/api/v1/demons/?name=Sunset%20Sandstorm", function(data) {
    console.log(data[0].position)
  })
})

var darkMode = false

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
