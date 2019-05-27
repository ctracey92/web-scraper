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
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//Routes

//Route to scrap for articles:
app.get("/scrape",function(req,res){
    axios.get("ic.wizards.com/en/articles/archive").then(function(response){
        let $ = cheerio.load(response.data);

        $("article-item-extend").each(function(i,element){
            let result = {};
            result.headline = $(this)
            .children("title")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");
            result.summary = $(this)
            .children("description")
            .text();
            
            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(err){
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });   
});


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  