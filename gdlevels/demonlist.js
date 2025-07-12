console.log("Demonlist script loaded.");
console.log(document.title);

$(document).ready(function() {
  $(".listdemon").each(function() {
    // Get the current link element
    var $link = $(this);
    console.log("Processing object: " + $link[0]);

    // Get the demon ID from the data-id attribute
    var demonID = $link.data("id");
    console.log("Demon ID: " + demonID);

    // Construct the API URL using the demon ID
    var apiURL = "https://pointercrate.com/api/v2/demons/?level_id=" + encodeURIComponent(demonID);
    console.log("API URL: " + apiURL);

    // Fetch the demon data from the API
    $.getJSON(apiURL, function(data) {
      if (data.length > 0) {
        var placement = data[0].position;
        $link.text("(#" + placement + ")");
        $link.attr("href", "https://pointercrate.com/demonlist/" + placement);
      } else {
        $link.text("(N/A)");
      }
    }
    // Handle error if the API request fails (somehow)
    ).fail(function() {
      $link.text("(Error fetching demonlist data. If you see this text, Pointercrate is probably down...)");
    });
  });
});

//THIS APPLICATION DOESN'T WORK YET. DO NOT UNDER ANY CIRCUMSTANCES TRY TO LOOK
//AT THIS FOR YOUR OWN EDUCATIONAL PURPOSES OR YOU'LL LEARN HOW TO CODE WRONG, THANKS.
