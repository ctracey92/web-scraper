//Constant packages needed
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");

//Require all of the models
const db = require("./models");

const PORT = process.env.PORT || 3000;

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

// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scrapedArticles", { useNewUrlParser: true });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapedArticles";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes

app.get("/scrape",function(req,res){
  axios.get("https://news.un.org/en/news").then(function(response) {
    var $ = cheerio.load(response.data);
    let promises = [];

    //Running the code below in your shell creates an index that allows for the unique:true to work.
    // db.Article.createIndex({"title":1},{unique:true});
  
    $(".views-row").each(function(i, element) {
      

      let result = {};
      result.title = $(element).find(".story-title").text();
      
      result.link = "https://news.un.org/en/news" + $(element).find("a").attr("href");

      result.summary = $(element).find(".news-body").text();

      result.photo = $(element).find("img").attr("src")

      if(!result.title){return}

      promises.push(db.Article.create(result))
    })   
    Promise.all(promises).then(() => res.end())   
  })
});

//Route to grab all the data from the DB.
app.get("/",function(req,res){
    db.Article.find({},function(err,data){
        console.log(data)
      if(err){console.log(err)}
      else{res.render("articles",{"articles":data})}
    })
});

app.get("/articles/:id", function(req, res) {
    db.Article.findById(req.params.id).populate("comments").exec(function(err,data){
        console.log(data,"*****")
      if(err){res.json(err)}
      res.render("comments",{"articles":data})
    })
});


app.post("/notes/:id", function(req, res) {
    db.Comment.create(req.body)
      .then(function(data){
        return db.Article.findOneAndUpdate({_id: req.params.id},{ $push: { comments: data._id } }, { new: true })
      })
      .then(function(dbArticle){
        res.json(dbArticle)
      })
      .catch(function(err){
        res.json(err)
      })
  });

  app.delete("/notes/:id", function(req, res) {
     db.Comment.deleteOne({_id: req.params.id})
     .then(function(err,data){
         if (err) {res.json(err)};
     })
  });

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  