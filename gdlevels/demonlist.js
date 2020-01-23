$(async function() {
  for(var i=0; i < demonlist.length; i++) {
    await $.getJSON( "https://pointercrate.com/api/v1/demons/?name=" + demonlist[i], function(data) {
      console.log(data[0].position)
      $("#demonlist tr td")[4*i + 1].innerHTML = $("#demonlist tr td")[4*i + 1].innerHTML.replace("$$", data[0].position)
    })
  }

})

var demonlist = ["Sunset Sandstorm", "Black Blizzard", "Epsilon"]