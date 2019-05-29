//Constant packages needed
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");

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

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes

app.get("/scrape",function(req,res){
    axios.get("https://magic.wizards.com/en/articles/archive").then(function(response) {
    var $ = cheerio.load(response.data);

    //Running the code below in your shell creates an index that allows for the unique:true to work.
    // db.Article.createIndex({"title":1},{unique:true});
  
    $(".article-item-extended").each(function(i, element) {

        let result = {};
      result.title = $(element).find("h3").text();
      
      result.link = "https://magic.wizards.com" + $(element).find("a").attr("href");

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
  axios.get("https://dnd.wizards.com/articles").then(function(response) {
    var $ = cheerio.load(response.data);

    $(".article-preview").each(function(i, element) {

      let result = {};

      result.title = $(element).find("h4").text();
      
      result.link = "https://dnd.wizards.com/articles" +  $(element).find("a").attr("href");

      result.summary = $(element).find(".summary").text();


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
        console.log(data)
      if(err){console.log(err)}
      else{res.render("articles",{"articles":data})}
    })
});

app.get("/articles/:id", function(req, res) {
    db.Article.findById(req.params.id).populate("notes").exec(function(err,data){
      if(err){res.json(err)}
      res.render("comments",{"articles":data})
    })
});


app.post("/notes/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(data){
        return db.Article.findOne({_id: req.params.id})
        .populate("note")
      })
      .then(function(dbArticle){
        res.json(dbArticle)
      })
      .catch(function(err){
        res.json(err)
      })
  });

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  