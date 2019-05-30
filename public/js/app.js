let callScraper =  function (){
    $.ajax({
        method: "GET",
        url: "/",
        success: function(){
          document.location.reload(true)
  
        }
      }).then(function() {
        document.location.reload(true);
      });
}

$(document).on("click", ".scrape", function() {
    // Now make an ajax call for the Article
    callScraper();
    
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

$(document).on("click",".deleteBtn",function(){
  let id = $(this).attr("data-id")
  $.ajax({
    method: "DELETE",
    url: "/notes/" + id,
  })
  .then(function(data){
    console.log(data,"Comment Deleted")
    document.location.reload(true)
  })
})

