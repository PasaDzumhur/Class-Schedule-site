const express = require("express");
const session = require("express-session");
const http = require('http');
const url = require('url');

const app = express();

app.use(express.static(__dirname+"/public"));
app.get('/',function (req,res){
    var param=url.parse(req.url,true).query.q;
    res.sendFile(__dirname+"/public/" + param);

});






app.listen(3000);
