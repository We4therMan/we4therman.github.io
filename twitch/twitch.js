$(function() {
  refreshColors()
  $("#darkMode").click(function(){
    darkMode = !darkMode
    setCookie("darkMode", darkMode)
    refreshColors()
  })

  $("#next-clip").on("click", randomClip(clipIDs));
})

var darkMode = (getCookie("darkMode") == "true") ? true : false;
var clipIDs = [];
// const clipIDs = [
//   "DarlingOnerousGalagoOSfrog-awCHwGHpmnxIL652",
//   "ElegantScrumptiousTitanFunRun",
//   "CallousZanyTigerDuDudu"
// ];
const clientID = "hybxycfqunpq57mgsvydiczvgfvuxo";
const userID = "267427959";

function getAccessTokenFromUrl() {
  const hash = window.location.hash.substring(1); // Remove the '#'
  const params = new URLSearchParams(hash);
  return params.get('access_token');
}

const accessToken = getAccessTokenFromUrl();
console.log(accessToken); 

fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${userID}&first=20`, {
  headers: {
    'client-ID': clientID,
    'Authorization': `Bearer ${accessToken}`
  }
})
.then(res => res.json())
.then(data => {
  const clipIDs = data.data.map(clip => clip.id);
  console.log(clipIDs);
});

function randomClip(idList) {
  const randID = idList[Math.floor(Math.random() * idList.length)];
  console.log(`playing random clip: ${randID}`)
  const src = `https://clips.twitch.tv/embed?clip=${randID}&parent=we4therman.github.io/twitch/&autoplay=true`;
  $("#clip-player").attr("src", src);
  $("#auth-text").text("If that button doesn't work you probably need to click this link first")
}

function refreshColors() {
  if (darkMode == true) {
    $(".background").css({"background": "none", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.1)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.1)"})
    $("#darkMode").css({"background-color": "black", "color": "white"})
    $("#darkMode span").text("Light Mode")
  } else {
    $(".background").css({"background": "url('../img/bg.png') ", "background-color": "black"})
    $(".box").css({"background-color": "rgba(255,0,0,0.6)"})
    $(".blueBox").css({"background-color": "rgba(0,0,255,0.25)"})
    $("#darkMode").css({"background-color": "rgba(255,0,0,0.5)", "color": "white"})
    $("#darkMode span").text("Dark Mode")
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
