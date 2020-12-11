//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var path = require('path');
// var sslRedirect = require('heroku-ssl-redirect');
//var robots = require('robots.txt');
var compression = require('compression');


const app = express();
// app.use(sslRedirect());
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(compression());
app.use(express.static("public"));
app.use(require('prerender-node'));
// app.use( require('express-force-domain')('https://akash-rao-mallareddy-projects.github.io/certificate-verification/'));
// app.use(robots(__dirname + '/robots.txt'));


mongoose.connect("mongodb+srv://admin:admin@cluster0.x36xu.mongodb.net/certificateDB", {useNewUrlParser: true, useUnifiedTopology: true});
const certificateSchema = {
  certNo : String,
  event : String,
  date : String,
  mail : String,
  name : String,
  role : String,
  certUrl : String,
  description : String
};

const Certificate = mongoose.model("Certificate",certificateSchema);




//rooting
app.get("/", function(req,res){
  res.render("index");
});
app.get("/events", function(req,res){
  res.render("events");
});
app.get("/halloffame", function(req,res){
  res.render("halloffame");
});
app.get("/links", function(req,res){
  res.render("links");
});
app.get("/team", function(req,res){
  res.render("team");
});
app.get("/verify-long", function(req,res){
  res.render("verify-long");
});

// app.get('/sitemap.xml', function(req, res){
//     res.contentType('application/xml');
//     res.sendFile(path.join(__dirname , 'sitemap.xml'));
// });


//verifyurl
app.get("/verify", function(req, res){
  const requestedCertId = req.query.certno;
  console.log(requestedCertId);

  Certificate.findOne({certId:requestedCertId},function(err,certificate){
    if(!err){
      if(!certificate){
        res.render("failure");
      }
      else{
        res.render("verify",{
          certid:requestedCertId,
          certNo : certificate.certId,
          event : certificate.event,
          date : certificate.date,
          mail : certificate.mail,
          name:certificate.name,
          role:certificate.role,
          certUrl: certificate.certUrl,
          description: certificate.description
        });
      }
  }

  });

});

app.post("/verify", function(req, res){
  const certId = req.body.certid;
  res.redirect("http://certificate-verification-akash.herokuapp.com/verify/?certno=" +certId);
});


app.use(function(req,res){
    res.status(404).render("404");
});



//end

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port,function(){
  console.log("Server is running successfully.")
});
