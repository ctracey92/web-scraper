let reload = function(){

    $(document).ajaxStop(function(){window.location.reload(true); });
    // window.location.reload(true);
}
let callScraper =  function (){
    $.ajax({
        method: "GET",
        url: "/scrape",
        success: function(){
        // $(document).ajaxStop(function(){window.location.reload(true); });
        // reload();
        }
      }).then(function() {
        // reload();
      });
}

$(document).on("click", ".scrape", function() {
    // Now make an ajax call for the Article
    callScraper();
    reload();
   
});


$(document).on("click", "#submitComment",function(){
    // Grab the id associated with the article from the submit button
  var thisId = $("#grabbedArticle").attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {
      body: $("#commentBox").val(),
      article: thisId,
    }
  })
    .then(function(data) {
      // Log the response
      console.log(data);

    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#commentBox").val("");
});


$(document).on("click", ".comment", function() {
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
