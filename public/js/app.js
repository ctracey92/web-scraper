let reload = function(){
    window.location.reload(true);
}
let callScraper =  function (){
    $.ajax({
        method: "GET",
        url: "/scrape",
        success: function(data){
            window.location.reload();
        }
      }).then(function(data) {
          console.log(data);
      });
}

$(document).on("click", ".scrape", function() {
    // Now make an ajax call for the Article
    callScraper();
    // reload();
   
});