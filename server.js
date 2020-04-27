#!/usr/bin/env node
const express = require("express");
const app = new express();

const stream = require('./ytstream');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser'); //.cookie
const session = require('express-session'); //.session


app.use(cors());
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",resave:true,saveUninitialized:true}));

const uri = "https://www.youtube.com/watch?v=";

app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' https://apis.google.com");
  res.setHeader('Set-Cookie', "myCookie=cookieValue;Path=/");
  return next();
});

/* Serve website folder */
app.use(express.static(__dirname + '/'));
//app.use(express.static('/styles',__dirname + '/styles'));

app.get("/audio1", (req, res) => {
  let songId = req.query.songId;
  console.log('YTat1='+songId);
  stream(uri.concat(songId)).pipe(res);
});

app.get("/audio2", (req, res) => {
  let songId = req.query.songId;
  console.log('YTat2='+songId);
  stream(uri.concat(songId)).pipe(res);
});

app.get('/', function(req, res){
  console.log("serve!")
  res.cookie('name', 'cookiexpress');//.send('cookie set\n'); //Sets name = express

  if (req.session.page_views){
    req.session.page_views++;
    //req.send
    res.cookie('cookiexpressPV',req.session.page_views,{});
    res.send('You just called get!\n');
  }else {
    req.session.page_views=1;
    res.cookie('cookiexpressPV',req.session.page_views,{});
    res.send('You just called get for the first time!\n');
  }
  console.log(req.session.page_views)
});

app.listen(PORT, () => console.log("Ready!"));
