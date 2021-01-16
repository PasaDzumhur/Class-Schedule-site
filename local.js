const express = require("express");
const session = require("express-session");
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');
const fs = require('fs');
const {Sequelize , Op} = require('sequelize');
const db = require('./utils/baza');
db.sequelize.sync();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+"/public"));

app.get('/v2/dani', function (req,res){
    let json = [];
    db.dan.findAll().then(dani=>{
        for(let dan in dani){
            json.push({id : dan.id, naziv : dan.naziv});
        }
        res.json(json);
    })
})

app.post('/v2/dani', function (req,res){
    naziv= req.body.naziv;
    if(naziv=="Ponedjeljak" || naziv =="Utorak" || naziv =="Srijeda" || naziv=="Četvrtak" || naziv == "Petak" || naziv == "Subota" || naziv =="Nedjelja"){
        db.dan.findOrCreate({where : {naziv : naziv}, defaults : {naziv : naziv}}).then(([model,created])=>{
            if(created) res.json({message : "Dan uspješno unesen"});
            else res.json({message : "Dan već postoji"});
        })
    }else res.json({message : "Nevalidno ime dana"});
})

app.get('/v2/grupe', function (req,res){
    let json = [];
    db.grupa.findAll().then(grupe=>{
        for(let grupa in grupe){
            json.push({id : grupa.id, naziv : grupa.naziv});
        }
        res.json(json);
    })
})

app.post('/v2/grupe', function (req,res){
    naziv = req.body.naziv;
    predmetId = req.body.predmetId;
    db.predmet.findOne({where : {id : predmetId}}).then(trazeniPredmet=>{
        if(trazeniPredmet){
            db.grupa.findOrCreate({where : {naziv : naziv}, defaults : {naziv : naziv,predmetId : predmetId}}).then(([model,created])=>{
                if(created) res.json({message : "Grupa uspješno unesena"});
                else res.json({message : "Grupa već postoji"});
            })
        }else {
            res.json("Ne postoji taj predmet");
        }
    })
    /*
    db.grupa.findOrCreate({where : {naziv : naziv}, defaults : {naziv : naziv}}).then(([model,created])=>{
        if(created) res.json({message : "Grupa uspješno unesena"});
        else res.json({message : "Grupa već postoji"});
    })*/

})

app.get('/v2/predmeti', function (req,res){
    let json = [];
    db.predmet.findAll().then(predmeti=>{
        for(let predmet in predmeti){
            json.push({id : predmet.id, naziv : predmet.naziv});
        }
        res.json(json);
    })
})

app.post('/v2/predmeti', function (req,res){
    naziv= req.body.naziv;
    db.predmet.findOrCreate({where : {naziv : naziv}, defaults : {naziv : naziv}}).then(([model,created])=>{
        if(created) res.json({message : "Predmet uspješno unesen"});
        else res.json({message : "Predmet već postoji"});
    })

})

app.get('/v2/tipovi', function (req,res){
    let json = [];
    db.tip.findAll().then(tipovi=>{
        for(let tip in tipovi){
            json.push({id : tip.id, naziv : tip.naziv});
        }
        res.json(json);
    })
})

app.post('/v2/tipovi', function (req,res){
    naziv= req.body.naziv;
    db.tip.findOrCreate({where : {naziv : naziv}, defaults : {naziv : naziv}}).then(([model,created])=>{
        if(created) res.json({message : "Tip uspješno unesen"});
        else res.json({message : "Tip već postoji"});
    })

})




app.get('/v2/studenti/:ime',function (req,res){

    db.student.findOne({where:{ime : req.params.ime}}).then(function (student){
        if(student) res.json({ime : student.ime, indeks : student.indeks});
        else res.json({message : "Trazeni student ne postoji"});
    })

})

app.get('/v2/studenti',function (req,res){
    db.student.findAll().then(function (studenti){
        let json = [];

        for(let i = 0; i<studenti.length; i++){
            json.push({ime : studenti[i].ime, indeks : studenti[i].indeks});
        }
        res.json(json);
    })
})
/*
app.get('/v2/aktivnosti',function (req,res){
    let json =[];
    db.aktivnost.findAll().then(aktivnosti =>{
        for ( let aktivnost in aktivnosti){
            let id = aktivnost.id;
            let naziv = aktivnost.naziv;
            let pocetak = aktivnost.pocetak;
            let kraj = aktivnost.kraj;
            let predmetId = aktivnost.predmetId;
            let grupaId = aktivnost.grupaId;
            let danId = aktivnost.danId;
            let tipId = aktivnost.tipId;
            db.predmet.findOne({where : {id: predmetId}}).then(trazeniPredmet => {
                predmet = trazeniPredmet.naziv;
                db.grupa.findOne({where : {id : grupaId}}).then(trazenaGrupa => {
                    grupa = trazenaGrupa.naziv;
                    db.dan.findOne({where : {id : danId}}).then(trazeniDan => {
                        dan = trazeniDan.naziv;
                        db.tip.findOne({where : {id : tipId}}).then(trazeniTip => {
                            tip = trazeniTip.naziv;

                            json.push({id : id, naziv : naziv, pocetak : pocetak, kraj : kraj,
                            predmet : predmet, grupa : grupa, dan : dan, tip : tip});
                        })
                    })
                })
            })
        }
    })
    res.json(json);
})

 */

app.post('/v2/studenti', function (req,res){
    let ime = req.body.ime;
    let indeks = req.body.indeks;

    db.student.findOrCreate({where : {indeks : indeks}, defaults : {ime : ime, indeks : indeks}}).then(([user,created])=>{
        if(created) res.json({message : "Student uspješno unesen"});
        else res.json({message : "Student već postoji"});
    })
});

app.post('/v2/aktivnosti',function (req,res){
    let naziv = req.body.naziv;
    let pocetak = req.body.pocetak;
    let kraj = req.body.kraj;
    let predmetId = req.body.predmetId;
    let grupaId = req.body.grupaId;
    let danId = req.body.danId;
    let tipId = req.body.tipId;
    if(pocetak<8 || pocetak>21 || kraj<8 || kraj>21){
        res.json("Aktivnost nije validna!");
        return ;
    }
    if((!Number.isInteger(pocetak) && Math.abs(Math.round(pocetak)-pocetak)!=0.5) || (!Number.isInteger(kraj) && Math.abs(Math.round(kraj)-kraj)!=0.5)) {
        res.json({message: "Aktivnost nije validna!"});
        return ;
    }
    db.aktivnost.findAll({where : {danId : danId}}).then(function (aktivnosti){
        for ( let i = 0 ; i<aktivnosti.length; i++){
            let granicaPocetak= aktivnosti[i].pocetak;
            let granicaKraj = aktivnosti[i].kraj;
            if((pocetak>=granicaPocetak && pocetak<granicaKraj) || (kraj>granicaPocetak && kraj<=granicaKraj)){
                res.json({message: "Aktivnost nije validna!"});
                return ;
            }
        }
        db.grupa.findOne({where : {id : grupaId}}).then(grupaTrazena =>{
            if(grupaTrazena) {
                db.tip.findOne({where: {id: tipId}}).then(tipTrazeni => {
                    if(tipTrazeni){
                        db.dan.findOne({where : {id : danId}}).then(danTrazeni =>{
                            if(danTrazeni){
                                db.predmet.findOne({where : {id : predmetId}}).then(predmetTrazeni =>{
                                    if(predmetTrazeni){
                                        let json = {naziv : naziv, pocetak : pocetak, kraj : kraj, predmetId : predmetId, grupaId : grupaId, danId : danId, tipId : tipId };
                                        db.aktivnost.create(json).then(response =>{
                                            res.json({message : "Aktivnost uspješno dodana"});
                                        }).catch(err=>{
                                            console.log(err);
                                            res.json({message :"Aktivnost nije dodana zbog errora"});
                                        })
                                        return ;
                                    }else res.json({message : "Aktivnost nije dodana zbog predmeta"});
                                })


                            } else res.json({message : "Aktivnost nije dodana zbog dana"});
                        })
                    } else res.js({message : "Aktinvost nije dodana zbog tipa"});

                })
            }else res.json({message : "Aktivnost nije dodana zbog grupe"});
        })

    })
})

app.get('/v2/aktivnosti',function (req,res){


    db.aktivnost.findAll().then(function (aktivnosti){
        let json = [];
        let promise = new Promise(function (resolve,reject)
        {
            for (let i = 0; i < aktivnosti.length; i++) {
                console.log((aktivnosti.length));

                console.log("grupa " + aktivnosti[i].grupaId);
                console.log("tip " + aktivnosti[i].tipId);
                console.log("dan " + aktivnosti[i].danId);
                console.log("predmet " + aktivnosti[i].predmetId);
                db.grupa.findOne({where: {id: aktivnosti[i].grupaId}}).then(grupaTrazena => {
                    if (grupaTrazena) {
                        console.log(grupaTrazena.naziv);
                        db.tip.findOne({where: {id: aktivnosti[i].tipId}}).then(tipTrazeni => {
                            if (tipTrazeni) {
                                console.log(tipTrazeni.naziv);
                                db.dan.findOne({where: {id: aktivnosti[i].danId}}).then(danTrazeni => {
                                    console.log("dovde");
                                    if (danTrazeni) {
                                        console.log(danTrazeni.naziv);
                                        db.predmet.findOne({where: {id: aktivnosti[i].predmetId}}).then(predmetTrazeni => {
                                            if (predmetTrazeni) {
                                                console.log(predmetTrazeni.naziv);
                                                json.push({
                                                    id: aktivnosti[i].id,
                                                    naziv: aktivnosti[i].naziv,
                                                    pocetak: aktivnosti[i].pocetak,
                                                    kraj: aktivnosti[i].kraj,
                                                    predmet: predmetTrazeni.naziv,
                                                    grupa: grupaTrazena.naziv,
                                                    dan: danTrazeni.naziv,
                                                    tip: tipTrazeni.naziv
                                                });
                                                if(i==aktivnosti.length-1) resolve();
                                                //console.log(json);
                                                /*console.log(json2);
                                                json.push(json2);*/

                                            } //else res.json({message: "Aktivnost nije dodana zbog predmeta"});
                                        })


                                    } //else res.json({message: "Aktivnost nije dodana zbog dana"});
                                })
                            } //else res.js({message: "Aktinvost nije dodana zbog tipa"});

                        })
                    } //else res.json({message: "Aktivnost nije dodana zbog grupe"});
                    console.log("dovde dodje");
                })
            }
        }).then(nemamPojma=>{
            res.json(json);
        })
        /*console.log("Stvarno nemam blage veze zasto dovde dodje");
        res.json(json);*/
    })
})



app.put('/v2/studenti/:indeks', function (req,res){
    let ime = req.body.ime;
    let indeks = req.body.indeks;
    db.student.update({ime : ime, indeks: indeks}, {where : {indeks : req.params.indeks}}).then(function (rowsUpdated){
        if(rowsUpdated>0) res.json({message : "Student uspješno izmjenjen"});
        else res.json({message : "Student ne postoji"});
    })
});

app.delete('/v2/studenti/:indeks',function (req,res){
    db.student.destroy({where : {indeks : req.params.indeks}}).then(function(rowsUpdated){
        if(rowsUpdated>0) res.json({message : "Student uspješno izbrisan"});
        else res.json({message : "Student ne postoji"});
    })
})





app.get('/v1/predmet',function (req,res){
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

app.post('/v1/predmet',function (req,res){
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

app.get('/v1/aktivnosti',function (req,res){
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

app.post('/v1/aktivnost',function (req,res){
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
    if(dan!="Ponedjeljak" && dan!="Utorak" && dan!="Srijeda" && dan!="Četvrtak" && dan!="Petak") res.json({message: "Aktivnost nije validna!"});
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

app.get('/v1/predmet/:naziv/aktivnosti',function (req,res){
    let buf = fs.readFileSync("aktivnosti.txt");
    let link = req.url;
    let parametri = link.split('/');
    let naziv = parametri[2];


    let text = buf.toString();
    let redovi = text.split('\n');
    let json=[];

    for(let i = 0; i<redovi.length; i++){
        if(redovi[i]=="") continue;
        let red = redovi[i].split(",");
        if(red[0]==naziv){
            json.push({naziv : red[0], tip : red[1], pocetak : red[2], kraj : red[3], dan : red[4]});

        }
    }

    res.json(json);
})

app.delete('/v1/predmet/:naziv',function (req,res){
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

app.delete('/v1/aktivnost/:naziv',function (req,res){
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

app.delete("/v1/all",function (req,res){
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


