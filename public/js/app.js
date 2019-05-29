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
    // event.preventDefault();
    let text = $("#commentBox").val()
    // Grab the id associated with the article from the submit button
  var thisId = $("#grabbedArticle").attr("data-id");


  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {
      body: text,
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


