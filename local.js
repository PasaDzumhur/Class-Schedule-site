const express = require("express");
const session = require("express-session");
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
console.log("testPrije");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));
app.get('/predmeti',function (req,res){
    //console.dir("test");
    let param=url.parse(req.url,true).query;

    fs.readFile("predmeti.txt",function read (err,buf){

        if(err) console.log(err);
        //res.writeHead(200, {'Content-Type': 'application/json'});
        let text = buf.toString();
        //console.log("text");
        let textovi = text.split('\n');
        //

        let stringJson = "[";
        for( let i = 1; i<textovi.length; i++){
            if(i!=1) stringJson+=",";
            stringJson += "{'"+textovi[0]+"':'"+textovi[i]+"'}";
        }
        stringJson+="]";
        res.json(stringJson);

        //res.json({textovi});
    });

    //res.send("radi");



});









app.listen(3000);
