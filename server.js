//Constant packages needed
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

//Require all of the models
const db = require("./models");

const PORT = 3000;

//Initialize Express
const app = express();

//Add in middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapedArticles", { useNewUrlParser: true });

//Routes

app.get("/scrape",function(req,res){
    axios.get("https://magic.wizards.com/en/articles/archive").then(function(response) {
    var $ = cheerio.load(response.data);
  
    console.log("working");
  
    $(".article-item-extended").each(function(i, element) {

        let result = {};

        //       // Add the text and href of every link, and save them as properties of the result object
      result.heading = $(element).find("h3").text();
      
      result.link = $(element).find("a").attr("href");

      result.summary = $(element).find(".description").text();
  
  
      db.Article.create(result)
              .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
              });
          });
  });
  res.send("Scrape Complete")
});

//Route to grab all the data from the DB.
app.get("/data",function(req,res){
    db.Article.find({},function(err,data){
      if(err){console.log(err)}
      else{res.json(data)}
    })
  })

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  