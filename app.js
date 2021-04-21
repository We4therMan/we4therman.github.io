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
    $(".background").css({"background": "url('https://lh3.googleusercontent.com/pw/ACtC-3fblOlX2Air5h9xTgnPzTEEQbl7L_aUWpmQFoofDg2DYzrCg7t5rxAeqFS19Bw7E-eG86qj0ss6yJRWmrQgsIObkURLd5apBbfcQZP7NYzkRicstaObo5Z8eZWQv0agpahWIoPeB_TYtogyQ_a9l0SwVdCC0kLTTGNHzl-VUIyJxBfRckzkBuNREQPzNWmDeEdiF4U-uALTeXm3DdB_yJpuljIlKIApO2zebQx-LxwKxIK-N9Yqs-1NsH5NNy6Ai842TkIDzb-BEygNGEpyBvxX0pazxqV3EdKIqyfNz812ZRuaOQ4vA6iM055mlczPjHkLE-q9ylBsn9aZgxL--S9okHdqqanKoqO6cm3khOsz6iKKj7-jniNB8l3G5ubQEL-il_XhYzMAbOfM9cEeNyT03_ILeVB78PsMVAXwcyzoEp0xt_rBn73cFTPK3EygfK9SnH4hqTuJx5CNKsJRtjFMAqeKFFYIDrs9-hA4YpZi5qdMKmcNLOhw1Ho9zlrHNXmUvch2I0jZUd57BU3IuoCaCuY-6eC3_aN1X5xf3euY2hOJQYyEnW6h2jv7QRM7SLBMKauaSr4uC0vI8-qFNC8RVDw25qTtDsEeAmMznzlhTSbv_1be8cYfyn08CQvgPhI-6QVNHQsG0h2UNYK679e3X_lr4LMj9PjwDkUhzN5_Umtv3os9LqdiEjl9FJv51tlg8Bom7b4DfaYDsfwkuXqCf_W-FEkgrD1C4Hu13N1IZWVS=w548-h220-no?authuser=0') ", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.6)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.25)"})
    $("#darkMode").css({"background-color": "rgba(255,0,0,0.5)", "color": "white"})
    $("#darkMode span").text("Dark Mode")
  }
}

function easterEgg() {
  switch (count) {
    case 69:
    $("#easterEgg").html("Good job! You found the third secret added to this website.<br><br>Secret 3: ")
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
