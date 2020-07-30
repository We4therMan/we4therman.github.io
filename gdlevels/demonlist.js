$(async function() {
//  for(var i=0; i < demonlist.length; i++) {
//    await $.getJSON( "https://pointercrate.com/api/v1/demons/?name=" + demonlist[i], function(data) {
//      console.log(data[0].position)
//      $("#demonlist tr td")[i + 1].innerHTML = $("#demonlist tr td")[i + 1].innerHTML.replace("$$", data[0].position)
//    })
//  }
$.getJSON("https://pointercrate.com/api/v1/demons/?name=Sunset%20Sandstorm", function(data){
  console.log("Sunset Sandstorm position: " + data.position)
}
$("#ssss").innerHTML.replace("$$", )

})

var demonlist = ["Sunset Sandstorm", "Black Blizzard"]

console.log("Secret 2: I dream of being a GD Mod.")
console.log("Hey, you're not doing too bad! Keep looking for more secrets! You'll keep finding interesting stuff.")

var demonAPI = "https://pointercrate.com/api/v1";


//THIS APPLICATION IS VERY BROKEN AND INCOMPLETE. DO NOT UNDER ANY CIRCUMSTANCES TRY TO LOOK
//AT THIS FOR YOUR OWN EDUCATIONAL PURPOSES OR YOU'LL LEARN HOW TO CODE WRONG THANKS.
