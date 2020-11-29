//jshint esversion:6

require("dotenv").config();
const c=require("express");
const body=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app =c();
console.log(process.env.SECRET)
;app.use(body.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(c.static("public"));
mongoose.connect("mongodb://localhost:27017/userdb",{ useNewUrlParser: true, useUnifiedTopology: true }  );
//for encryptio use only mongoose schema
const userschema=new mongoose.Schema ({
	email:String,
	password:String
})
//for encrpting the password
userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]}); 
const model=new mongoose.model("user",userschema)
app.get("/",function(req,res){
	res.render("home");

})
app.get("/register",function(req,res){
	res.render("register");
})

app.get("/login",function(req,res){
	res.render("login");
})
app.get("/logout",function(req,res){
	res.render("home");
})
app.post("/register",function(req,res){
	const newuser=new model({
		email:req.body.username,
		password:req.body.password
	})
	newuser.save(function(err){
		if(err){
			console.log(err);
		}else{
			res.render("secrets",{user2:req.body.username});
		}
	})

});
app.post("/login",function(req,res){
	const us=req.body.username;
	const pa=req.body.password;
	model.findOne({email:us},function(err,found){
		if(!found){
			console.log("sorry username not found");
		}else{
			if(found){
				if(found.password===pa){
					res.render("secrets",{user2:req.body.username});
					
				}

			}
		}
	})

});









app.listen(4444,function (){
	console.log("server started at port 4444");
})