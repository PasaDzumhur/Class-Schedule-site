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
app.use(express.json());
app.use(express.static(__dirname+"/public"));

app.get('/predmeti',function (req,res){
    fs.readFile("predmeti.txt",function read (err,buf){
        if(err) {
            console.log(err);
            return ;
        }
        let text = buf.toString();
        let textovi = text.split('\n');
        let stringJson = "[";
        for( let i = 1; i<textovi.length; i++){
            if(i!=1) stringJson+=",";
            stringJson += "{'"+textovi[0]+"':'"+textovi[i]+"'}";
        }
        stringJson+="]";
        res.json(stringJson);

    });
});

app.post('/predmeti',function (req,res){
    console.log("test");
    let tijelo = req.body;
    console.log(tijelo);

    let novaLinija="\n"+tijelo["naziv"];
    fs.appendFile('predmeti.txt',novaLinija,function (err){
        if(err){
            console.log(err);
            return;
        }
        console.log("Predmet uspjesno dodat");
        res.json({message: "Uspjesno dodan predmet"});
    })


})

app.get('/aktivnosti',function (req,res){
    fs.readFile("aktivnosti.txt",function read(err,buf){
        if(err) {
            console.log(err);
            return ;
        }
        let text = buf.toString();
        let redovi = text.split('\n');
        let stringJson="[";
        let head = redovi[0].split(',');
        for(let i = 1; i<redovi.length; i++){
            let red = redovi[i].split(",");
            if(i!=1)stringJson+=",";
            stringJson+="{'"+head[0]+"':'"+red[0]+"','"+head[1]+"':'"+red[1]
            +"','"+head[2]+"':'"+red[2]+"','"+head[3]+"':'"+red[3]+"','"+
                head[4]+"':'"+red[4]+"'}";
        }
        stringJson+="]";
        res.json(stringJson);
    })
})
app.get('/predmet/:naziv/aktivnosti',function (req,res){
    fs.readFile("aktivnosti.txt",function read(err,buf){
        if(err) {
            console.log(err);
            return ;
        }
        //var naziv=url.parse(req.url,true).query.predmet.naziv;
        let link = req.url;
        let parametri = link.split('/');
        let naziv = parametri[2];


        let text = buf.toString();
        let redovi = text.split('\n');
        let stringJson="[";
        let head = redovi[0].split(',');
        for(let i = 1; i<redovi.length; i++){
            let red = redovi[i].split(",");
            if(red[0]==naziv){

                if(i != 1) stringJson += ",";
            stringJson += "{'" + head[0] + "':'" + red[0] + "','" + head[1] + "':'" + red[1]
                + "','" + head[2] + "':'" + red[2] + "','" + head[3] + "':'" + red[3] + "','" +
                head[4] + "':'" + red[4] + "'}";
        }
        }
        stringJson+="]";
        res.json(stringJson);
    })
})








app.listen(3000);
