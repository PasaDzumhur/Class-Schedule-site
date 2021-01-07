let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../local");
const fs = require("fs");

chai.should();
chai.use(chaiHttp);
let assert = chai.assert;


/*
describe('Spirala 3 testovi', () =>{

    describe('GET predmeti testovi', () =>{
        it('Mora vratiti sve predmete',(done) =>{
            chai.request(server)
                .get("/predmet").end(((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            }))
        })
    })
})*/

describe('testovi iz txt-a',() =>{
    let buf = fs.readFileSync("test/testniPodaci.txt");
    let text = buf.toString();
    let testovi = text.split('\n');
    describe('testovi',()=>{
        /*after(()=>{
            fs.readFile("predmetiRezerva.txt", function read(err,buf){
                if(err){
                    throw err;
                }
                let text = buf.toString();
                fs.writeFile("predmeti.txt",text, function (err){
                    if(err){
                        throw err;
                    }

                })
                fs.readFile("aktivnostiRezerva.txt", function read(err,buf){
                    if(err){
                        throw err;
                    }
                    let text = buf.toString();
                    fs.writeFile("aktivnosti.txt",text, function (err){
                        if(err){
                            throw err;
                        }

                    })
                })
            })
        })*/
        after(()=>{
            let bufPredmeti = fs.readFileSync("predmetiRezerva.txt");
            let predmeti = bufPredmeti.toString();
            fs.writeFileSync("predmeti.txt",predmeti+'\n');
            let bufAktivnosti = fs.readFileSync("aktivnostiRezerva.txt");
            let aktivnosti = bufAktivnosti.toString();
            fs.writeFileSync("aktivnosti.txt",aktivnosti+'\n');
        })




        for(let i = 0; i<testovi.length; i++){
            //console.log(testovi[i]);
            it("test broj: "+i,(done) =>{
                //assert.equal(true,true);
                let parametri = testovi[i].split(',');
                let operacija = parametri[0];
                let ruta = parametri[1];
                let ulaz = parametri[2];
                let pocetakIzlaza = 3;
                if(parametri.length>6){
                    for(let j = 3; j<7; j++) ulaz += "," + parametri[j];
                    pocetakIzlaza=7;
                }
                let izlaz = parametri[pocetakIzlaza];
                for ( let j =pocetakIzlaza+1; j<parametri.length; j++) izlaz += "," +parametri[j];

                /*if(i==testovi.length-1){
                    console.log("operacija: " +operacija);
                    console.log("ruta: " +ruta);
                    console.log("ulaz: " +ulaz);
                    console.log("izlaz: " +izlaz);
                }*/
                izlaz = izlaz.replace(/\\/g,"");
                ulaz = ulaz.replace(/\\/g,"");
                if(operacija=="GET"){
                    chai.request(server)
                        .get(ruta).end(((err,res)=>{


                        assert.equal(izlaz,res.text);
                        done();
                    }))
                }else if(operacija=="POST"){

                    chai.request(server)
                        .post(ruta).send(JSON.parse(ulaz)).end(((err,res)=>{

                        assert.equal(izlaz,res.text);
                    }))
                    done();
                }else if(operacija=="DELETE"){

                    chai.request(server)
                        .delete(ruta).end(((err,res)=>{
                        assert.equal(izlaz,res.text);
                        done();
                    }))
                }

            })
        }
        //console.log("Doslo je dovde");
    })


})

