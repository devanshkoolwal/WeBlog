var express = require("express"),
    mongoose=require("mongoose"),  
    methodOverride = require("method-override"),
    bodyParser=require("body-parser"),
    expressSanitizer=require("express-sanitizer"),
    app =express();


    mongoose.connect("mongodb://localhost:27017/blog_app",{ useNewUrlParser: true,useUnifiedTopology: true });
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
    


    var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: {type: Date,default:Date.now}
    });

    var Blog = mongoose.model("Blog",blogSchema);

    // Blog.create({
    //     title: "Test Blog",
    //     image: "https://www.ryrob.com/wp-content/uploads/2019/08/What-is-a-Blog-How-a-Blog-is-Different-Than-a-Website-and-Blogging-Basics.jpg",
    //     body:  "This is a blog post"
    // });

    app.get("/", function(req,res){
        res.redirect("/blogs");
    });

    app.get("/blogs", function(req,res){
        Blog.find({}, function(err, blogs){
            if(err){
                console.log("Error!");
            }
            else{
                res.render("index",{blogs:blogs});
                
            }
        });
        
    });

    app.get("/blogs/new", function(req,res){
        res.render("new");
    });

    app.post("/blogs", function(req,res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        
        Blog.create(req.body.blog, function(err, newBlog){
            if(err){
                res.render("new")
            }
            else{
                res.redirect("/blogs")
            }
        })
    });

    app.get("/blogs/:id", function(req,res){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            }
            else{
                res.render("show", {blog: foundBlog});
            }
        })
    });

    app.get("/blogs/:id/edit", function(req,res){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            }
            else{
                res.render("edit",{blog: foundBlog});
            }
        })
        
    });

    app.put("/blogs/:id", function(req,res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err){
                res.redirect("/blogs");
            }
            else{
                res.redirect("/blogs/"+req.params.id);
            }
        });
    });

    app.delete("/blogs/:id", function(req,res){
        Blog.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.redirect("/blogs");
            }
            else{
                res.redirect("/blogs");
            }
        })
    })

    app.listen(8000, function(){
        console.log("Server Started");
    });
    
