$(function() {
  refreshColors()
  $("#darkMode").click(function(){
    darkMode = !darkMode
    setCookie("darkMode", darkMode)
    refreshColors()
    count++
    console.log(count)
    easterEgg()
  })

})

var darkMode = (getCookie("darkMode") == "true") ? true : false

var count = 0

function refreshColors() {
  if (darkMode == true) {
    $(".background").css({"background": "none", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.1)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.1)"})
    $("#darkMode").css({"background-color": "black", "color": "white"})
    $("#darkMode span").text("Light Mode")
  } else {
    $(".background").css({"background": "url('./img/bg.png')"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.25)"})
    $("#darkMode").css({"background-color": "rgba(255,0,0,0.5)", "color": "white"})
    $("#darkMode span").text("Dark Mode")
  }
}

function easterEgg() {
  switch (count) {
    case 69:
    $("#easterEgg").html("Good job! You found the third secret added to this website.<br><br>Secret 3: I've just added this secret after 5 years of not touching this website at all! <i>Your patience rewards you greatly, my friend!</i>")
    break;
    case 90:
    $("#easterEgg").html("You've reached my website. For now, this place is an empty desolate land that only allows you to stare at text endlessly as you await for secrets to be revealed. <i>It seems like you've already revealed this secret though, good job!</i>")
    break;
    case 110:
    $("#easterEgg").html("You can stop clicking now, that was the only secret here...")
    break;
    case 130:
    $("#easterEgg").html("I'm not lying, that was the only secret, go look elsewhere.")
    break;
    case 150:
    $("#easterEgg").html("You can't possibly like pressing the button <i>that</i> much...")
    break;
    case 170:
    $("#easterEgg").html("You can't be trusted with the dark mode button, I'll just remove it.")
    break;
    case 180:
    $("#easterEgg").html("haha rekt")
    $("#darkMode").hide()
  }
}

function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (999*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
