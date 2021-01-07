const express = require("express");
const session = require("express-session");
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+"/public"));

app.get('/predmet',function (req,res){
    let buf = fs.readFileSync("predmeti.txt");

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

app.post('/predmet',function (req,res){
    let tijelo = req.body;
    let naziv= tijelo["naziv"];
    let buf = fs.readFileSync("predmeti.txt");

    let text =buf.toString();
    let textovi = text.split('\n');
    for( let i = 0; i<textovi.length; i++){

        if(textovi[i]==naziv){
            res.json({message: "Naziv predmeta postoji"});
            return;
        }
    }
    let novaLinija=tijelo["naziv"]+"\n";
    fs.appendFileSync('predmeti.txt',novaLinija)

    res.json({message: "Uspješno dodan predmet!"});

})

app.get('/aktivnosti',function (req,res){
    let buf = fs.readFileSync("aktivnosti.txt");

    let text = buf.toString();
    let redovi = text.split('\n');
    let json=[];
    //let head = redovi[0].split(',');
    for(let i = 0; i<redovi.length; i++){
        if(redovi[i]=="") continue;
        let red = redovi[i].split(",");

        json.push({naziv : red[0], tip : red[1], pocetak : red[2], kraj : red[3], dan : red[4]});
    }
    //stringJson+="]";
    res.json(json);

})

app.post('/aktivnost',function (req,res){
    let tijelo = req.body;
    let buf = fs.readFileSync("aktivnosti.txt");

    let naziv = tijelo["naziv"];
    let tip = tijelo["tip"];
    let pocetak = parseFloat(tijelo["pocetak"]);
    let kraj = parseFloat(tijelo["kraj"]);
    if((!Number.isInteger(pocetak) && Math.abs(Math.round(pocetak)-pocetak)!=0.5) || (!Number.isInteger(kraj) && Math.abs(Math.round(kraj)-kraj)!=0.5)) res.json({message: "Aktivnost nije validna!"});
    if(pocetak<8 || pocetak>21 || kraj<8 || kraj>21) res.json({message: "Aktivnost nije validna!"});
    //if(!Number.isInteger(kraj) && Math.abs(Math.round(kraj)-kraj)!=0.5) res.json({message: "Aktivnost nije validna"});
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

                res.json({message: "Aktivnost nije validna!"});
                return ;
            }
        }
    }

    let novaLinija = naziv+","+tip+","+pocetak+","+kraj+","+dan+"\n";
    fs.appendFileSync('aktivnosti.txt',novaLinija);

    res.json({message: "Uspješno dodana aktivnost!"});


})

app.get('/predmet/:naziv/aktivnosti',function (req,res){
    let buf = fs.readFileSync("aktivnosti.txt");
    let link = req.url;
    let parametri = link.split('/');
    let naziv = parametri[2];


    let text = buf.toString();
    let redovi = text.split('\n');
    let json=[];

    for(let i = 0; i<redovi.length; i++){
        if(red[i]=="") continue;
        let red = redovi[i].split(",");
        if(red[0]==naziv){
            json.push({naziv : red[0], tip : red[1], pocetak : red[2], kraj : red[3], dan : red[4]});

        }
    }

    res.json(json);
})

app.delete('/predmet/:naziv',function (req,res){
    let buf = fs.readFileSync("predmeti.txt");

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
        fs.writeFileSync("predmeti.txt",noviFajl);

        res.json({message: "Uspješno obrisan predmet!"});

    }else{
        res.json({message: "Greška - predmet nije obrisan!"});
    }
})

app.delete('/aktivnost/:naziv',function (req,res){
    let buf = fs.readFileSync("aktivnosti.txt");
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
        fs.writeFileSync("aktivnosti.txt",noviFajl);

        res.json({message: "Uspješno obrisana aktivnost!"});

    }else{
        res.json({message: "Greška - aktivnost nije obrisana!"});
    }

})

app.delete("/all",function (req,res){
    try{
        fs.writeFileSync("predmeti.txt","");

        fs.writeFileSync("aktivnosti.txt","");
        res.json({message: "Uspješno obrisan sadržaj datoteka!"});
    }catch (err){
        res.json({message: "Greška - Sadržaj datoteka nije moguće obrisati"});
    }

})



const port = process.env.PORT || 3000;
module.exports = app.listen(port, () => console.log(`Listening on port ${port}...`));


