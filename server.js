const express = require("express");
const app = new express();
const stream = require('youtube-audio-stream');

const uri = "https://www.youtube.com/watch?v=";

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
    return next();
});
app.use(express.static(__dirname + '/'));


app.get("/audio1", (req, res) => {
  let songId = req.query.songId;
  console.log('YTat1='+songId);
  stream(uri.concat(songId)).pipe(res);
})

app.get("/audio2", (req, res) => {
  let songId = req.query.songId;
  console.log('YTat2='+songId);
  stream(uri.concat(songId)).pipe(res);
})

app.listen(3000, () => console.log("Ready!"))
