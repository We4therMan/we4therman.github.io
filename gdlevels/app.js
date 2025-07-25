$(function() {
  refreshColors()
  $("#darkMode").click(function(){
    darkMode = !darkMode
    setCookie("darkMode", darkMode)
    refreshColors()
  })
  $("#hideEmbed").click(function(){
    embedsOn = !embedsOn
    hideEmbeds()
  })
})

var darkMode = (getCookie("darkMode") == "true") ? true : false
var embedsOn = (getCookie("embedsOn") == "true") ? true : false
// var embedsOn = true

function hideEmbeds() {
  if (embedsOn == false){
    $(".embed").hide()
    $("#hideEmbed span").text("Show video embeds")
  } else {
    $(".embed").show()
    $("#hideEmbed span").text("Hide video embeds")
  }
}

function refreshColors() {
  if (darkMode == true) {
    $(".background").css({"background": "none", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.1)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.1)"})
    $("#darkMode").css({"background-color": "black", "color": "white"})
    $("#darkMode span").text("View light mode")
  } else {
    $(".background").css({"background": "url('../img/bg.png') ", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.6)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.25)"})
    $("#darkMode").css({"background-color": "rgba(255,0,0,0.5)", "color": "white"})
    $("#darkMode span").text("View dark mode")
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
