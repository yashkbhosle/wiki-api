const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB");
app.set('view engine','ejs');
// mongoose.set('strictQuery', true);
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


const articleSchema = mongoose.Schema({
    title:String,
    content:String
})

const article = mongoose.model("article",articleSchema);

const artcile1 = new article({
    title:"Today's latest new",
    content:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex eius, omnis, odit, eveniet obcaecati doloremque amet sed esse vitae veniam assumenda iusto dignissimos corporis molestias pariatur! Consectetur illo ratione impedit!"
})

app.route("/articles").get((req,res)=>{
    article.find({},(err,found)=>{
        if(!err){
            res.send(found);
        } else{
            res.send(err);
        }
        
    })
})
.post((req,res)=>{
    console.log(req.body);
    const articlePost = new article({
        title:req.body.title,
        content:req.body.content
    })
    articlePost.save((err)=>{
        if(err){
            res.send(err);
        } else{
            res.send("successfully added data");
        }
    });
    
})
.delete((req,res)=>{
    article.deleteMany((err)=>{
        if(!err){
            res.send("all articles deleted");
        } else{
            console.log(err);
        }
    })
})


//targeting a specifc article
app.route("/articles/:articleTitle")
.get((req,res)=>{
    
    article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        } else{
            res.send("No matching article");
        }
        
    })
})
.put((req,res)=>{
    article.updateOne({title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        (err)=>{
        if(!err){
            res.send("Successfully updated")
        } else{
            console.log(err);
        }
    })
})
.patch((req,res)=>{
    console.log(req.body);
    article.updateOne({title:req.params.articleTitle},{$set:req.body},{ runValidators: true },(err)=>{
        if(!err){
            res.send("Successfullly updated")
        } else{
            res.send(err);
        }
    })
})
.delete((req,res)=>{
    article.deleteOne({title:req.params.articleTitle},(err)=>{
        if(err){
            res.send(err);
        } else{
            res.send("Successfully deleted");
        }
    })
})

// app.get("/articles")

// app.post("/articles",)
// app.delete("/articles",)

app.listen(3000);