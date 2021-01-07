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

app.get('/predmet',function (req,res){
    fs.readFile("predmeti.txt",function read (err,buf){
        if(err) {
            console.log(err);
            return ;
        }
        let text = buf.toString();
        let textovi = text.split('\n');
        let json = [];
        for( let i = 0; i<textovi.length; i++){
            /*if(i!=0) stringJson+=",";
            //stringJson += "{'"+textovi[0]+"':'"+textovi[i]+"'}";
            stringJson += "{\"naziv\":\""+ textovi[i]+"\"}";*/
            if(textovi[i]=="") continue;
            json.push({naziv : textovi[i]});
        }
        //stringJson+="]";
        res.json(json);

    });
});

app.post('/predmet',function (req,res){
    console.log("test");
    let tijelo = req.body;
    console.log(tijelo);
    let naziv= tijelo["naziv"];
    fs.readFile("predmeti.txt",function read(err,buf){
        if(err) {
            console.log(err);
            return ;
        }
        let text =buf.toString();
        let textovi = text.split('\n');
        for( let i = 0; i<textovi.length; i++){
            console.log(textovi[i]);
            if(textovi[i]==naziv){
                res.json({message: "Naziv predmeta postoji"});
                return;
            }
        }
        let novaLinija=tijelo["naziv"]+"\n";
        fs.appendFile('predmeti.txt',novaLinija,function (err){
            if(err){
                console.log(err);
                return;
            }
            console.log("Predmet uspjesno dodat");
            res.json({message: "Uspješno dodan predmet!"});
        })
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
        let json=[];
        //let head = redovi[0].split(',');
        for(let i = 0; i<redovi.length; i++){
            let red = redovi[i].split(",");

            json.push({naziv : red[0], tip : red[1], pocetak : red[2], kraj : red[3], dan : red[4]});
        }
        //stringJson+="]";
        res.json(json);
    })
})

app.post('/aktivnost',function (req,res){
    let tijelo = req.body;
    fs.readFile("aktivnosti.txt",function read(err,buf){
        if(err) {
            console.log(err);
            return ;
        }
        let naziv = tijelo["naziv"];
        let tip = tijelo["tip"];
        let pocetak = parseFloat(tijelo["pocetak"]);
        let kraj = parseFloat(tijelo["kraj"]);
        if(!Number.isInteger(pocetak) && Math.abs(Math.round(pocetak)-pocetak)!=0.5) res.json({message: "Aktivnost nije validna"});
        if(!Number.isInteger(kraj) && Math.abs(Math.round(kraj)-kraj)!=0.5) res.json({message: "Aktivnost nije validna"});
        let dan = tijelo["dan"];
        let text =buf.toString();
        let textovi = text.split('\n');
        for(let i = 0 ; i<textovi.length; i++){
            let info = textovi[i].split(',');
            //console.log(dan + "??" + info[4]);
            if(info[4]==dan){
                let granicaPocetak = parseFloat(info[2]);
                let granicaKraj = parseFloat(info[3]);
                if((pocetak>=granicaPocetak && pocetak<granicaKraj) || (kraj>granicaPocetak && kraj<=granicaKraj)){
                    console.log("proslo");
                    res.json({message: "Aktivnost nije validna"});
                    return ;
                }
            }
        }

        let novaLinija = naziv+","+tip+","+pocetak+","+kraj+","+dan+"\n";
        fs.appendFile('aktivnosti.txt',novaLinija,function (err){
            if(err){
                console.log(err);
                return;
            }

            res.json({message: "Uspješno dodana aktivnost!"});
        })
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
        let json=[];

        for(let i = 1; i<redovi.length; i++){
            let red = redovi[i].split(",");
            if(red[0]==naziv){
                json.push({naziv : red[0], tip : red[1], pocetak : red[2], kraj : red[3], dan : red[4]});

            }
        }

        res.json(json);
    })
})

app.delete('/predmet/:naziv',function (req,res){
    fs.readFile("predmeti.txt",function read(err,buf){
        if(err){
            console.log(err);
            return;
        }
        let link = req.url;
        let parametri = link.split('/');
        let naziv = parametri[2];
        let text = buf.toString();
        let textovi = text.split('\n');
        //let izbrisan=false;

        let filter = textovi.filter(function (value,index,arr){
            return naziv!=value;
        });
        if(textovi.length!=filter.length){
            let noviFajl ="";
            for(let i = 0; i<filter.length; i++){
                if(i!=0) noviFajl+="\n";
                noviFajl+=filter[i];
            }
            fs.writeFile("predmeti.txt",noviFajl,function (err){
                if(err) {
                    console.log(err);
                    return ;
                }
                res.json({message: "Predmet izbrisan"});
            })
        }else{
            res.json({message: "Greška - predmet nije izbrisan!"});
        }
    })
})

app.delete('/aktivnost/:naziv',function (req,res){
    fs.readFile("aktivnosti.txt",function read(err,buf){
        if(err){
            console.log(err);
            return;
        }
        let link = req.url;
        let parametri = link.split('/');
        let naziv = parametri[2];
        let text = buf.toString();
        let textovi = text.split('\n');
        let filter = textovi.filter(function (value,index,arr){
            let red = value.split(",");
            return red[0]!=naziv;
        });
        if(textovi.length!=filter.length){
            let noviFajl ="";
            for(let i = 0; i<filter.length; i++){
                if(i!=0) noviFajl+="\n";
                noviFajl+=filter[i];
            }
            fs.writeFile("aktivnosti.txt",noviFajl,function (err){
                if(err) {
                    console.log(err);
                    return ;
                }
                res.json({message: "Aktivnost izbrisana"});
            })
        }else{
            res.json({message: "Greška - Aktivnost nije izbrisana!"});
        }
    })
})

app.delete("/all",function (req,res){
    fs.writeFile("predmeti.txt","",function (err){
        if(err){
            console.log(err);
            res.json({message: "Greška - Sadržaj datoteka nije moguće obrisati"});
        }
    });
    fs.writeFile("aktivnosti.txt","",function (err){
        if(err){
            console.log(err);
            res.json({message: "Greška - Sadržaj datoteka nije moguće obrisati"});
        }
    });
    res.json({message: "Uspješno obrisan sadržaj datoteka!"});
})



const port = process.env.PORT || 3000;
module.exports = app.listen(port, () => console.log(`Listening on port ${port}...`));


