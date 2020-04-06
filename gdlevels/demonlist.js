$(async function() {
  for(var i=0; i < demonlist.length; i++) {
    await $.getJSON( "https://pointercrate.com/api/v1/demons/?name=" + demonlist[i], function(data) {
      console.log(data[0].position)
      $("#demonlist tr td")[3*i + 1].innerHTML = $("#demonlist tr td")[3*i + 1].innerHTML.replace("$$", data[0].position)
    })
  }

})

var demonlist = ["Sunset Sandstorm", "Black Blizzard", "Epsilon"]

console.log("Secret 2: I dream of being a GD Mod.")
console.log("Hey, you're not doing too bad! Keep looking for more secrets! You'll keep finding interesting stuff.")
