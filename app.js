
var express   = require("express"),
    mongoose  = require("mongoose"),
    methodOveride=require("method-override"),
    expressSanitizer=require("express-sanitizer");
    BodyParser= require("body-parser"),
    app       = express();

mongoose.connect("mongodb://localhost:27017/BlogApp",{ useNewUrlParser: true ,useUnifiedTopology: true});
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(expressSanitizer());
app.use(BodyParser.urlencoded({extended:true}));
app.use(methodOveride("_method"));

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    decription:String,
    Date:{type:Date,default:Date.now}
});
var Blog=mongoose.model("BlogApp",blogSchema);
;

app.get("/",function(req,res)
{
    res.redirect("/blogs");

});

app.get("/blogs",function(req,res)
{
    Blog.find({},function(err,blog)
    {
        if(err)
            console.log(err);
        else
            res.render("index",{blog:blog});
    })
    

});
app.get("/blogs/new",function(req,res)
{
    res.render("new");

});

app.post("/blogs",function(req,res)
{ 
    Blog.create(req.body.blog,function(err,blog)
    {
            if(err)
                res.render("blogs/new");
            else
                res.redirect("/blogs");

    });

});
app.get("/blogs/:id",function(req,res)
{
    Blog.findById(req.params.id,function(err,blog)
    {
        if(err)
            console.log(err);
        else
            res.render("show",{blog:blog});
    });
});

app.get("/blogs/:id/edit",function(req,res)
{ 
    Blog.findById(req.params.id,function(err,blog)
    {
        if(err)
            res.redirect("/blogs");
        else
            res.render("edit",{blog:blog});

    });

});

app.put("/blogs/:id",function(req,res)
{
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog)
    {
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/"+req.params.id);
    });
})

app.delete("/blogs/:id",function(req,res)
{
    Blog.findByIdAndRemove(req.params.id,function(err,blog)
    {
        if(err)
            res.redirect("/blogs");
        else    
            res.redirect("/blogs");
    });

});

app.listen(3001,function()
{
    console.log("Server has started");

});