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
        /*
        for(let dan in dani){
            json.push({id : dan.id, naziv : dan.naziv});
        }*/
        dani.forEach(dan => {
            json.push({id : dan.id, naziv : dan.naziv});
        })
        res.json(json);
    })
})





app.put('/v2/dani/:id',function (req,res){
    let naziv = req.body.naziv;
    if(naziv=="Ponedjeljak" || naziv =="Utorak" || naziv =="Srijeda" || naziv=="Četvrtak" || naziv == "Petak" || naziv == "Subota" || naziv =="Nedjelja") {
        db.dan.findOne({where : {naziv : naziv}}).then(provjeraPostojanja =>{
            if(provjeraPostojanja) res.json({message : "Taj dan već postoji"});
            else {
                db.dan.update({naziv: naziv}, {where: {id: req.params.id}}).then(rowsUpdated => {
                    if (rowsUpdated > 0) res.json({message: "Dan uspješno promijenjen"});
                    else res.json({message: "Ne postoji dan sa tim id-em"});
                })
            }
        })

    }else res.json({message : "Nevalidan naziv dana"});
})

app.delete('/v2/dani/:id', function (req,res){
    db.dan.destroy({where : {id : req.params.id}}).then(rowsUpdated => {
        if(rowsUpdated>0) {
            db.aktivnost.destroy({where : {danId : req.params.id}}).then(rowsUpdated => {
                res.json({message : "Dan uspješno izbrisan"});
            })
            //res.json({message : "Dan uspješno izbrisan"});
        }
        else res.json({message : "Ne postoji dan sa tim nazivom"});
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
        console.log(grupe.length);

        grupe.forEach(grupa => {
            json.push({id : grupa.id, naziv : grupa.naziv,predmetId : grupa.predmetId});
        })
        res.json(json);
    })
})

app.delete('/v2/grupe/:id',function (req,res){
    db.grupa.destroy({where : {id : req.params.id}}).then(rowsUpdated => {
        if(rowsUpdated>0) {
            db.aktivnost.destroy({where : {grupaId : req.params.id}}).then(rowsUpdated => {
                res.json({message : "Grupa uspješno izbrisana"});
            })

        }
        else res.json({message : "Ne postoji grupa sa tim nazivom"});
    })
})

app.put('v2/grupe/:id',function (req,res){
    let naziv = req.body.naziv;
    let predmetId = req.body.predmetId;
    db.grupa.findOne({where : {naziv : naziv}}).then(provjeraPostojanja => {
        if(provjeraPostojanja) res.json({message : "Već postoji ista grupa na tom predmetu"});
        else {
            db.grupa.update({naziv : naziv, predmetId : predmetId},{where : {id : req.params.id}}).then(rowsUpdated => {
                if(rowsUpdated>0) res.json({message : "Grupa uspješno izmjenjena"});
                else res.json({message : "Ne postoji grupa sa tim nazivom"});
            })
        }
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
})

app.get('/v2/predmeti', function (req,res){
    let json = [];
    db.predmet.findAll().then(predmeti=>{
        /*
        for(let predmet in predmeti){
            json.push({id : predmet.id, naziv : predmet.naziv});
        }*/
        predmeti.forEach(predmet =>{
            json.push({id : predmet.id, naziv : predmet.naziv});
        })
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

app.put('/v2/predmeti/:id', function (req,res){
    naziv = req.body.naziv;
    db.predmet.findOne({where : {naziv : naziv}}).then(provjeraPostojanja => {
        if(provjeraPostojanja) res.json({message : "Predmet sa tim nazivom već postoji"});
        else {
            db.predmet.update({naziv : naziv}, {where : {id : req.params.id}}).then(rowsUpdated => {
                if(rowsUpdated>0) res.json({message : "Predmet uspješno izmjenjen"});
                else res.json({message : "Ne postoji grupa sa tim id-em"});
            })
        }
    })
})

app.delete('/v2/predmeti/:id', function (req,res){
    db.predmet.destroy({where : {id : req.params.id}}).then(rowsUpdated => {
        if(rowsUpdated>0) {
            db.aktivnost.destroy({where : {predmetId : req.params.id}}).then(rowsUpdated => {
                res.json({message : "Predmet uspješno izbrisan"});
            })

        }
        else res.json({message : "Ne postoji predmet sa tim id-em"});
    })
})

app.get('/v2/tipovi', function (req,res){
    let json = [];
    db.tip.findAll().then(tipovi=>{
        /*
        for(let tip in tipovi){
            json.push({id : tip.id, naziv : tip.naziv});
        }*/
        tipovi.forEach(tip=>{
            json.push({id : tip.id, naziv : tip.naziv});
        })
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

app.put('/v2/tipovi/:id', function (req,res){
    naziv = req.body.naziv;
    db.tip.findOne({where : {naziv : naziv}}).then(provjeraPostojanja => {
        if(provjeraPostojanja) res.json({message : "Tip sa tim nazivom već postoji"});
        else {
            db.tip.update({naziv : naziv}, {where : {id : req.params.id}}).then(rowsUpdated => {
                if(rowsUpdated>0) res.json({message : "Tip uspješno izmjenjen"});
                else res.json({message : "Ne postoji tip sa tim id-em"});
            })
        }
    })
})

app.delete('/v2/tipovi/:id', function (req,res){
    db.tip.destroy({where : {id : req.params.id}}).then(rowsUpdated => {
        if(rowsUpdated>0) {
            db.aktivnost.destroy({where : {tipId : req.params.id}}).then(rowsUpdated => {
                res.json({message : "Tip uspješno izbrisan"});
            })

        }
        else res.json({message : "Ne postoji tip sa tim id-em"});
    })
})

app.delete('/v2/dani/:id' ,function (req,res){
    db.dan.destroy({where : {id : req.params.id}}).then(rowsUpdated => {
        if(rowsUpdated>0) {
            db.aktivnost.destroy({where : {danId : req.params.id}}).then(rowsUpdated => {
                res.json({message : "Dan uspješno izbrisan"});
            })

        }
        else res.json({message : "Ne postoji dan sa tim id-em"});
    })
})

app.put('/v2/dani/:id', function (req,res){
    naziv = req.body.naziv;
    if(naziv=="Ponedjeljak" || naziv =="Utorak" || naziv =="Srijeda" || naziv=="Četvrtak" || naziv == "Petak" || naziv == "Subota" || naziv =="Nedjelja") {
        db.dan.findOne({where: {naziv : naziv}}).then(provjeraPostojanja => {
            if (provjeraPostojanja) res.json({message: "Dan sa tim nazivom već postoji"});
            else {
                db.dan.update({naziv: naziv}, {where: {id: req.params.id}}).then(rowsUpdated => {
                    if (rowsUpdated > 0) res.json({message: "Dan uspješno izmjenjen"});
                    else res.json({message: "Ne postoji dan sa tim id-em"});
                })
            }
        })
    }else res.json({message : "Nevalidno ime dana"});
})




app.get('/v2/studenti/:indeks',function (req,res){

    db.student.findOne({where:{indeks : req.params.indeks}}).then(function (student){
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

app.post('/v2/viseStudenata/:grupa', function (req,res){

    var studenti = req.body;
    let grupaNaziv = req.params.grupa;
    var promiseList = [];
    console.log("duzina: " + studenti.length);
    db.grupa.findOne({where : {naziv : grupaNaziv}}).then(grupa => {
        console.log(grupa.naziv);
        for(let i = 0; i<studenti.length; i++){
            let student = studenti[i];
            console.log(student.ime);
            promiseList.push(db.student.findOrCreate({where : {indeks : student.indeks},
                defaults : student}).then(([model,created]) => {
                if(created) {

                    model.setStudentiGrupe(grupa).then(nesto => {
                        return new Promise((resolve, reject) => {
                            resolve([]);
                        })
                    })
                }
                else {
                    if(student.ime !=model.ime){
                        json.push({message : "Student " + student.ime + " " + student.indeks + " nije upisan jer postoji student "
                                +model.ime + " " + model.indeks +  "sa istim indeksom " + student.indeks});
                        //})
                        return new Promise((resolve, reject) => {
                            resolve(json);
                        })
                    }else{
                        model.setStudentiGrupe(grupa).then(nesto => {
                            return new Promise((resolve, reject) => {
                                resolve([]);
                            })
                        })
                    }

                    //model.foreach(stariStudent => {
                    /*
                    json.push({message : "Student " + student.ime + " " + student.indeks + " nije upisan jer postoji student "
                            +model.ime + " " + model.indeks +  "sa istim indeksom " + student.indeks});
                    //})
                    return new Promise((resolve, reject) => {
                        resolve(json);
                    })*/
                }
            }))
        }
        for(let i = 0 ; i<promiseList.length; i++) console.log(promiseList[i]);
        Promise.all(promiseList).then(text => {
            //res.status=200;

            res.json(text);
        })
    })

})

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

        if(grupaId==null){
            db.tip.findOne({where: {id: tipId}}).then(tipTrazeni => {
                if(tipTrazeni){
                    db.dan.findOne({where : {id : danId}}).then(danTrazeni =>{
                        if(danTrazeni){
                            db.predmet.findOne({where : {id : predmetId}}).then(predmetTrazeni =>{
                                if(predmetTrazeni){
                                    let json = {naziv : naziv, pocetak : pocetak, kraj : kraj, predmetId : predmetId, grupaId : null, danId : danId, tipId : tipId };
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
        }else {


            db.grupa.findOne({where: {id: grupaId}}).then(grupaTrazena => {
                if (grupaTrazena) {
                    db.tip.findOne({where: {id: tipId}}).then(tipTrazeni => {
                        if (tipTrazeni) {
                            db.dan.findOne({where: {id: danId}}).then(danTrazeni => {
                                if (danTrazeni) {
                                    db.predmet.findOne({where: {id: predmetId}}).then(predmetTrazeni => {
                                        if (predmetTrazeni) {
                                            let json = {
                                                naziv: naziv,
                                                pocetak: pocetak,
                                                kraj: kraj,
                                                predmetId: predmetId,
                                                grupaId: grupaId,
                                                danId: danId,
                                                tipId: tipId
                                            };
                                            db.aktivnost.create(json).then(response => {
                                                res.json({message: "Aktivnost uspješno dodana"});
                                            }).catch(err => {
                                                console.log(err);
                                                res.json({message: "Aktivnost nije dodana zbog errora"});
                                            })
                                            return;
                                        } else res.json({message: "Aktivnost nije dodana zbog predmeta"});
                                    })


                                } else res.json({message: "Aktivnost nije dodana zbog dana"});
                            })
                        } else res.js({message: "Aktinvost nije dodana zbog tipa"});

                    })
                } else res.json({message: "Aktivnost nije dodana zbog grupe"});
            })
        }

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
                if(aktivnosti[i].grupaId ==null){
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
                                                dan: danTrazeni.naziv,
                                                tip: tipTrazeni.naziv
                                            });
                                            if(i==aktivnosti.length-1) resolve();
                                        }
                                    })
                                }
                            })
                        }
                    })
                }else {
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
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

            }
        }).then(nemamPojma=>{
            res.json(json);
        })
    })
})

app.delete('/v2/aktivnosti/:id', function (req,res){
    db.aktivnost.destroy({where : {id : req.params.id}}).then(rowsUpdated => {
        if(rowsUpdated>0) res.json({message : "Aktivnost uspješno izbrisana"});
        else res.json({message : "Ne postoji aktivnost sa tim id-om"});
    })
})

app.put('/v2/aktivnosti/:id', function (req,res){
    naziv = req.body.naziv;
    pocetak = req.body.pocetak;
    kraj = req.body.kraj;
    predmetId = req.body.predmetId;
    grupaId = req.body.grupaId;
    danId = req.body.danId;
    tipId = req.body.tipId;
    db.aktivnost.findOne({where : {id : req.params.id}}).then(aktivnost =>{
        if(aktivnost){
            db.grupa.findOne({where: {id: grupaId}}).then(grupaTrazena => {
                if (grupaTrazena) {
                    //console.log(grupaTrazena.naziv);
                    db.tip.findOne({where: {id: tipId}}).then(tipTrazeni => {
                        if (tipTrazeni) {
                            //console.log(tipTrazeni.naziv);
                            db.dan.findOne({where: {id: danId}}).then(danTrazeni => {
                                //console.log("dovde");
                                if (danTrazeni) {
                                    //console.log(danTrazeni.naziv);
                                    db.predmet.findOne({where: {id: predmetId}}).then(predmetTrazeni => {
                                        if (predmetTrazeni) {
                                            //console.log(predmetTrazeni.naziv);
                                            let json = {
                                                naziv: naziv,
                                                pocetak: pocetak,
                                                kraj: kraj,
                                                predmet: predmetTrazeni,
                                                grupa: grupaTrazena,
                                                dan: danTrazeni,
                                                tip: tipTrazeni
                                            };
                                            db.aktivnost.update(json,{where : { id : req.params.id}}).then(rowsUpdated => {
                                                if(rowsUpdated>0) res.json({message : "Aktivnost uspješno izmjenjena"});
                                                else res.json({message : "Aktivnost sa trazenim id-em ne postoji"});
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
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

app.get('/v2/student-grupe', function (req,res){


    let json= [];
    let promiseList = [];
    db.grupa.findAll().then(grupe => {
        grupe.forEach(grupa => {
            promiseList.push(grupa.getGrupeStudenta().then(studenti =>{
                studenti.forEach(student => {
                    let naziv = grupa.naziv;
                    console.log(student.naziv);
                    json.push({student : student.ime, grupa : naziv})
                })
            }).then(()=> {
                return new Promise(((resolve, reject) => {
                    resolve();
                }))
            }))
        })
        Promise.all(promiseList).then(()=>{res.json(json);})
    })


})



app.post('/v2/student-grupe',function (req,res){


    let studentId = req.body.studentId;
    let grupaId = req.body.grupaId;
    console.log(studentId);
    console.log(grupaId);
    db.student.findOne({where : {id : studentId}}).then(student => {
        if(student){
            db.grupa.findOne({where : {id : grupaId}}).then(grupa => {
                if(grupa){
                    grupa.setGrupeStudenta([student]).then(nesto => {
                        res.json({message :"Student uspješno upisan u grupu"});
                    })
                }else res.json({message : "Ta grupa ne postoji"});
            })
        }else res.json({message : "Taj student ne postoji"});
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


